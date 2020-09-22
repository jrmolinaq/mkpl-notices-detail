import { Component, OnInit } from '@angular/core';
import { NoticeService } from './services/notice.service';

declare const Liferay: any;

@Component({
	templateUrl: 
		Liferay.ThemeDisplay.getPathContext() + 
		'/o/mkpl-notices-detail/app/app.component.html'
})
export class AppComponent {
	noticeInfo: Object;
  
	constructor(private noticeService: NoticeService) { }
  
	ngOnInit() {
	  this.getNoticeInfo();
	}
  
	getNoticeInfo() {
	  this.noticeService.getNoticeDetail(this.getURLParameter("id")).subscribe(notice => {
		this.noticeInfo = notice;
	  });
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
