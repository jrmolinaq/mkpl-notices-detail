import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { FormService } from './services/form.service';
import { ModalService } from './services/modal.service';
import { STATES, ORDER_STATES } from './constants/states';
import { NoticeService } from './services/notice.service';

import { FIELDS } from './constants/spare-parts-list-constants';
import { PurcharseOrderService } from './services/purcharse-order.service';
import { pluck } from 'rxjs/operators';

declare const Liferay: any;

@Component({
  selector: 'spare-parts-list',
  templateUrl:
    Liferay.ThemeDisplay.getPathContext() + 
    '/o/mkpl-notices-detail/app/spare-parts-list.component.html'
})
export class SparePartsListComponent implements OnInit {
  @Input() set spareParts(data: any) {
    this.$spareParts = data.sort((a: { id: number; }, b: { id: number; }) => (a.id > b.id ? -1 : 1));
  }
  @Output() completePurchase = new EventEmitter();
  $spareParts: any = [];
  form: FormGroup;
  states = STATES;
  commentLength = 0;
  manualState = ORDER_STATES.MANUAL;
  subsidiaryOptions: { id: number; name: string; }[] = [];
  providerOptions: { id: number; name: string; }[] = [];
  productSelected = {
    productId: 'null',
    orderId: 'null',
  };
  purcharseOrderError = {
    message: 'null',
    orderId: 'null',
  };

  constructor(
    private modalService: ModalService,
    private formService: FormService,
    private noticeService: NoticeService,
    private purcharseOrderService: PurcharseOrderService
  ) {}

  ngOnInit() {
    this.form = this.formService.createForm(FIELDS);
    this.noticeService.getProvider().subscribe(({ id, name }) => {
      this.providerOptions = [{ id, name }];
    });

    this.form.get('manualPurchase.provider').valueChanges.subscribe((id) => {
      this.getSubsidiaries(id);
    });
  }

  onCheck(productId: any, orderId: any) {
    this.productSelected = {
      productId,
      orderId,
    };
  }

  buyProduct() {
    const body = {
      product_id: this.productSelected.productId,
      nit: this.form.get('manualPurchase').value.nit,
      name: this.form.get('manualPurchase').value.social,
      subsidiary_id: this.form.get('manualPurchase').value.subsidiary,
      notice_id: this.getURLParameter("id"),
      price: this.form.get('manualPurchase').value.price,
      reference: this.form.get('manualPurchase').value.reference,
      comment: this.form.get('manualPurchase').value.comment,
    };
    this.noticeService.manualPurchase(body).subscribe(() => {
      this.closeManualPurchase();
      this.openModal('success-manual-purchase');
      this.completePurchase.emit();
      this.productSelected = {
        productId: null,
        orderId: null,
      };
    });
  }

  openPurcharseOrder(orderId: string) {
    this.purcharseOrderError = {
      message: null,
      orderId: null,
    };
    this.purcharseOrderService
      .getPurcharseOrderPDF(orderId)
      .pipe(pluck('url'))
      .subscribe(
        (url) => {
          window.open(url);
        },
        (error) => {
          this.purcharseOrderError = {
            message: error,
            orderId,
          };
        }
      );
  }

  getSubsidiaries(id: any) {
    this.noticeService.getSubsidiary(id).subscribe(
      ({ subsidiaries }) =>
        (this.subsidiaryOptions = subsidiaries.map((elem) => ({
          id: elem.id,
          name: elem.name,
        })))
    );
  }

  closeManualPurchase() {
    this.form.reset();
    this.closeModal('manual-purchase-form');
  }

  openModal(id: string) {
    this.modalService.open(id);
  }

  closeModal(id: string) {
    this.modalService.close(id);
  }

  inputItem(item: string) {
    this.commentLength = item.length;
  }

	// this.getURLParameter("id")
	private getURLParameter(paramName: string){
	  var pageURL = window.location.search.substring(1);
	  var variables = pageURL.split('&');
	  for (var i = 0; i < variables.length; i++) {
	    var param = variables[i].split('=');
	    if (param[0] == paramName) {
	      return param[1];
	    }
	  }
	}​
}
