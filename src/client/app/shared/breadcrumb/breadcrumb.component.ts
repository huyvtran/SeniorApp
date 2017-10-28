import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd, Params, PRIMARY_OUTLET } from '@angular/router';

interface IBreadcrumb {
  label: string;
  params?: Params;
  url: string;
}
@Component({
  moduleId: module.id,
  selector: 'sd-breadcrumb',
  templateUrl: 'breadcrumb.component.html',
  styleUrls: ['breadcrumb.component.css']
})
export class BreadcrumbComponent implements OnInit {
  public userLoggedIn = true;
  public breadcrumbs: IBreadcrumb[];
  public currentUrl: String;
  public breadCrumbUrl: Object[];


  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router) {
    this.breadcrumbs = [];

    router.events.subscribe((event) => {
      if (event instanceof NavigationEnd === true) {
        this.breadCrumbUrl = [];
        let stateUrlList = router.url.split('/');
        let stateUrl = router.url.split('/')[2];
        this.currentUrl = (stateUrl) ? stateUrl.charAt(0).toUpperCase() + stateUrl.slice(1) : '';
        //["", "home", "administration", "enrolldetails", "B00110Y7"]
        //["", "home", "administration", "enrolldetails", "B00110Y7", "payments", "B00110Y7"]

        if (this.currentUrl && this.currentUrl === 'Administration') {
          switch (stateUrlList.length) {
            case 5:
              if (stateUrlList[3] === 'enrolldetails') {
                this.breadCrumbUrl.push({ 'link': '/home/administration/enrollment/search', 'label': 'Administration' },
                  { 'link': '/home/administration/enrollment/', 'label': 'Enrollment' }, { 'link': '', 'label': 'Details' });
              } else {
                this.breadCrumbUrl.push({ 'link': '', 'label': this.currentUrl });
              }
              break;
            case 7:
              if (stateUrlList[5] === 'details') {
                let subState = (stateUrlList[5]) ? stateUrlList[5].charAt(0).toUpperCase() + stateUrlList[5].slice(1) : '';
                this.breadCrumbUrl.push({ 'link': '/home/administration/enrollment/search', 'label': 'Administration' },
                  { 'link': '/home/administration/enrollment/', 'label': 'Enrollment' }, { 'link': '', 'label': 'Details' });
              } else if (stateUrlList[5] === 'payments') {
                let subState = (stateUrlList[5]) ? stateUrlList[5].charAt(0).toUpperCase() + stateUrlList[5].slice(1) : '';
                this.breadCrumbUrl.push({ 'link': '/home/administration/enrollment/search', 'label': 'Administration' },
                  { 'link': '/home/administration/enrollment/', 'label': 'Enrollment' }, { 'link': '', 'label': 'Payments' });
              } else if (stateUrlList[5] === 'documents') {
                let subState = (stateUrlList[5]) ? stateUrlList[5].charAt(0).toUpperCase() + stateUrlList[5].slice(1) : '';
                this.breadCrumbUrl.push({ 'link': '/home/administration/enrollment/search', 'label': 'Administration' },
                  { 'link': '/home/administration/enrollment/', 'label': 'Enrollment' }, { 'link': '', 'label': 'Documents' });
              } else if (stateUrlList[5] === 'data') {
                let subState = (stateUrlList[5]) ? stateUrlList[5].charAt(0).toUpperCase() + stateUrlList[5].slice(1) : '';
                this.breadCrumbUrl.push({ 'link': '/home/administration/enrollment/search', 'label': 'Administration' },
                  { 'link': '/home/administration/enrollment/', 'label': 'Enrollment' }, { 'link': '', 'label': 'Data' });
              } else if (stateUrlList[5] === 'routed') {
                let subState = (stateUrlList[5]) ? stateUrlList[5].charAt(0).toUpperCase() + stateUrlList[5].slice(1) : '';
                this.breadCrumbUrl.push({ 'link': '/home/administration/enrollment/search', 'label': 'Administration' },
                  { 'link': '/home/administration/enrollment/', 'label': 'Enrollment' }, { 'link': '', 'label': 'Routed' });
              } else if (stateUrlList[5] === 'details') {
                let subState = (stateUrlList[5]) ? stateUrlList[5].charAt(0).toUpperCase() + stateUrlList[5].slice(1) : '';
                this.breadCrumbUrl.push({ 'link': '/home/administration/enrollment/search', 'label': 'Administration' },
                  { 'link': '/home/administration/enrollment/', 'label': 'Enrollment' }, { 'link': '', 'label': 'Details' });
              } else {
                this.breadCrumbUrl.push({ 'link': '', 'label': this.currentUrl });
              }
              break;
            default: this.breadCrumbUrl.push({ 'link': '', 'label': this.currentUrl });
          }
        } else if (this.currentUrl) {
          this.breadCrumbUrl.push({ 'link': '', 'label': this.currentUrl });
        } else {
          this.breadCrumbUrl = [];
        }
      }
    });
  }

  ngOnInit() {
    const ROUTE_DATA_BREADCRUMB: string = 'breadcrumb';

    //subscribe to the NavigationEnd event
    this.router.events.filter(event => event instanceof NavigationEnd).subscribe(event => {

      //set breadcrumbs
      let root: ActivatedRoute = this.activatedRoute.root;
      this.breadcrumbs = this.getBreadcrumbs(root);
    });
  }

  private getBreadcrumbs(route: ActivatedRoute, url: string = '', breadcrumbs: IBreadcrumb[] = []): IBreadcrumb[] {
    const ROUTE_DATA_BREADCRUMB: string = 'breadcrumb';

    //get the child routes
    let children: ActivatedRoute[] = route.children;

    //return if there are no more children
    if (children.length === 0) {
      return breadcrumbs;
    }

    //iterate over each children
    for (let child of children) {
      //verify primary route
      if (typeof child.outlet !== 'object' && child.outlet !== PRIMARY_OUTLET) {
        continue;
      }

      //verify the custom data property 'breadcrumb' is specified on the route
      if (!child.snapshot.data.hasOwnProperty(ROUTE_DATA_BREADCRUMB)) {
        return this.getBreadcrumbs(child, url, breadcrumbs);
      }

      //get the route's URL segment
      let routeURL: string = child.snapshot.url.map(segment => segment.path).join('/');

      //append route URL to URL
      url += `/${routeURL}`;

      //add breadcrumb
      let breadcrumb: IBreadcrumb = {
        label: child.snapshot.data[ROUTE_DATA_BREADCRUMB],
        params: child.snapshot.params,
        url: url
      };
      breadcrumbs.push(breadcrumb);

      //recursive
      return this.getBreadcrumbs(child, url, breadcrumbs);
    }

    //we should never get here, but just in case
    return breadcrumbs;
  }

}
