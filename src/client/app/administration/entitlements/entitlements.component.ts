import { Component, OnInit, Input, Output, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { TabMenuModule, MenuItem, TabViewModule, SelectItem, CheckboxModule } from 'primeng/primeng';
import { Router } from '@angular/router';
import { AdministrationService } from './../administration.service';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';

@Component({
    moduleId: module.id,
    selector: 'entitlement-tab',
    templateUrl: 'entitlements.component.html',
    styleUrls: ['entitlements.component.css'],
})
export class EntitlementsComponent implements OnDestroy, OnInit {
    @ViewChild('userIdInput') userIdInput: ElementRef;

    public searchResult: any = [];
    public showForm: boolean = false;
    public noEntitlementSelected: boolean = false;
    public activeTabIndex: Number = 0;
    public searchCriteria: any;
    public user_id: string = '';
    public noSearchResult: string = '';
    public userNoteFoundMsg: string = '';
    public errorMessage: string = null;
    public role_id: string = '';
    public request_ticket_id: string = '';
    public comment: string = '';
    public auditData: boolean = false;
    public auditList: any = [];
    public roleList: any = [
        { value: 'DEFAULT', label: 'DEFAULT' }, { value: 'IT_ADMIN', label: 'IT_ADMIN' },
        { value: 'BIZ_ADMIN', label: 'BIZ_ADMIN' }, { value: 'IT_USER', label: 'IT_USER' },
        { value: 'BIZ_USER', label: 'BIZ_USER' }
    ];
    public selectedRole: string = 'DEFAULT';
    public entitlementForm: any;
    public manageUserForm: any;
    public entitlementList: any = [
        { name: 'security_entitlement', label: 'Security', selected: false, id: 'security_1', value: '0-LEVEL-1|Security' },
        { name: 'reports_entitlement', label: 'Reports', selected: false, id: 'reports_2', value: '0-LEVEL-2|Reports' },
        { name: 'analytics_entitlement', label: 'Analytics', selected: false, id: 'analytics_3', value: '0-LEVEL-3|Analytics' },
        { name: 'admin_entitlement', label: 'Administration', selected: false, id: 'administration_4', value: '0-LEVEL-4|Administration' }
    ];

    public administrationEntitlementList: any = [
        { name: 'enrol_entitle', label: 'Enrolment', selected: false, id: 'admin_1', value: '1-LEVEL-5|Administration/Enrollments' },
        { name: 'entitle_entitle', label: 'Entitlement', selected: false, id: 'admin_2', value: '1-LEVEL-6|Administration/Entitlements' }
    ];

    /**
     * Constructor function
     */
    constructor(private router: Router, private adminService: AdministrationService, private formBuilder: FormBuilder) {
        this.searchResult = ['init'];
    }

    /**
     *
     */
    ngOnDestroy() { }// tslint:disable-line

    /**
     *
     */
    ngOnInit() {
        this.buildManageUserForm();
        this.buildEntitlementForm();
    }

    /**
     * Toggle search accrodance
     */
    public toggleSearchAccordance() {
        this.showForm = !this.showForm;
    }

    /**
     * Toggle event
     */
    public doToggle(toggleValue: any) {
        this.showForm = toggleValue;
    }

    /**
     * Search user from Manage user
     */
    public searchUser() {
        let userId = this.user_id;
        this.resetResult();
        this.applyMarkAsTouched(this.manageUserForm);
        this.user_id = userId;
        //console.log(this.el.nativeElement('userIdInput'));
        if (this.user_id.length === 0) {
            this.errorMessage = 'Please enter a User ID';
            //this.userIdInput.nativeElement.style.borderBottomColor = 'red !important';
        } else {
            // Call service
            //this.userIdInput.nativeElement.style.borderBottomColor = 'blue !important';
            let postData = {
                'userId': this.userIdInput.nativeElement.value,
                'currentUserRole': localStorage.getItem('SM_ROLE'),
                'currentUser': localStorage.getItem('userID')
            };
            this.adminService.getUserEntitlements(postData).subscribe((data: any) => {
                this.doToggle(true);
                //this.showResult = true;
                //enrollment['searchedCriteria'] = postData;
                if (data.responseCode !== '200' && data.responseCode !== '509') {
                    this.noSearchResult = data.status;
                    // User does not have role and entitlements. Use the form below to provide authorizations
                } else {
                    if (data.responseCode === '509') {
                        this.userNoteFoundMsg = 'User does not have role and entitlements. Use the form below to provide authorizations';
                    }
                    for (let currentEntitle of data.entitlementFormBean.currentRoleEntitlements) {
                        for (let index in this.entitlementList) {
                            if (this.entitlementList[index].value === currentEntitle) {
                                this.entitlementList[index].selected = true;
                            }
                        }
                        for (let index in this.administrationEntitlementList) {
                            if (this.administrationEntitlementList[index].value === currentEntitle) {
                                this.administrationEntitlementList[index].selected = true;
                            }
                        }
                    }
                    //console.log(data.entitlementFormBean.currentRole);
                    this.request_ticket_id = data.entitlementFormBean.ticketNumber;
                    this.comment = data.entitlementFormBean.comments;
                    let auditId = 0;
                    for (let auditLog of data.entitlementFormBean.auditLogs) {
                        console.log('auditLog');
                        console.log(auditLog);
                        if (auditLog.auditId > auditId) {
                            auditId = auditLog.auditId;
                            this.request_ticket_id = auditLog.ticketNo;
                            this.comment = auditLog.comment;
                        }
                    }
                    this.buildEntitlementForm();
                    this.selectedRole = (data.entitlementFormBean.currentRole === null)?'DEFAULT':data.entitlementFormBean.currentRole;
                    this.auditList = data.entitlementFormBean.auditLogs;
                    //console.log(this.auditList);
                    this.searchResult = data;
                }
            }, (error: any) => {
                //console.log('error : ' + error);
            });
        }
        // } else if (this.user_id.length !== 7) {
        //     this.errorMessage = 'Please enter a valid user id. User id should be 7 characters long.';
        // }
        //console.log('submit user search');
    }

    /**
     * Reset result
     */
    public resetResult() {
        this.errorMessage = null;
        this.request_ticket_id = '';
        this.user_id = '';
        this.comment = '';
        this.userNoteFoundMsg = '';
        this.noSearchResult = '';
        this.selectedRole = '';
        this.auditList = [];
        this.noEntitlementSelected = false;
        this.roleList = [
            { value: 'DEFAULT', label: 'DEFAULT' }, { value: 'IT_ADMIN', label: 'IT_ADMIN' },
            { value: 'BIZ_ADMIN', label: 'BIZ_ADMIN' }, { value: 'IT_USER', label: 'IT_USER' },
            { value: 'BIZ_USER', label: 'BIZ_USER' }
        ];
        this.entitlementList = [
            { name: 'security_entitlement', label: 'Security', selected: false, id: 'security_1', value: '0-LEVEL-1|Security' },
            { name: 'reports_entitlement', label: 'Reports', selected: false, id: 'reports_2', value: '0-LEVEL-2|Reports' },
            { name: 'analytics_entitlement', label: 'Analytics', selected: false, id: 'analytics_3', value: '0-LEVEL-3|Analytics' },
            { name: 'admin_entitlement', label: 'Administration', selected: false,
            id: 'administration_4', value: '0-LEVEL-4|Administration' }
        ];
        this.administrationEntitlementList = [
            { name: 'enrol_entitle', label: 'Enrolment', selected: false, id: 'admin_1', value: '1-LEVEL-5|Administration/Enrollments' },
            { name: 'entitle_entitle', label: 'Entitlement', selected: false,
            id: 'admin_2', value: '1-LEVEL-6|Administration/Entitlements' }
        ];
    }

    /**
     * List user entitlement details
     */
    public userEntitlements() {
        //console.log('show user entitlements');
    }

    applyMarkAsTouched(selectedForm: any) {
        for (let inner in selectedForm.controls) {
            selectedForm.get(inner).markAsTouched();
            selectedForm.get(inner).updateValueAndValidity();
        }
    }

    /**
     * Update entitlement details
     */
    public updateEntitlements() {
        this.noEntitlementSelected = false;
        let roleEntitlements = [];
        //console.log(this.entitlementForm.value.administrationEntitlement.length);
        for (let index in this.entitlementForm.value.entitlement) {
            if (this.entitlementForm.value.entitlement[index] === true) {
                roleEntitlements.push(this.entitlementList[index].value);
            }
        }
        for (let index in this.entitlementForm.value.administrationEntitlement) {
            if (this.entitlementForm.value.administrationEntitlement[index] === true) {
                roleEntitlements.push(this.administrationEntitlementList[index].value);
            }
        }
        if (roleEntitlements.length < 1) {
            this.noEntitlementSelected = true;
            //this.entitlementForm.controls.entitlement.setErrors({'incorrect': true});
        } else {
            this.noEntitlementSelected = false;
            //this.entitlementForm.controls.entitlement.setErrors(null);
        }

        if (this.entitlementForm.dirty && this.entitlementForm.valid && this.noEntitlementSelected === false) {
            let updatedData = {
                'userId': this.user_id,
                'userRole': this.selectedRole,
                'roleEntitlements': roleEntitlements,
                'currentUser': localStorage.getItem('userID'),
                'comments': (this.entitlementForm.value.comment)?this.entitlementForm.value.comment:'',
                'ticketNumber': this.entitlementForm.value.request_ticket_id
            };

            this.adminService.updateUserEntitlements(updatedData).subscribe((data: any) => {
                if (data.responseCode !== '200') {
                    this.noSearchResult = 'Failed to update entitlements for the user';
                    // User does not have role and entitlements. Use the form below to provide authorizations
                } else {
                    let updatedUserId = this.user_id;
                    this.resetResult();
                    this.user_id = updatedUserId;
                    // Saved, so reload the grid
                    this.searchUser();
                    this.userNoteFoundMsg = 'Saved Successfully !';
                }
            }, (error: any) => {
                //console.log('error : ' + error);
            });
            //console.log('updated entitlement');
            //console.log(updatedData);
        } else {
            this.searchResult = null;
            //this.buildEntitlementForm();
        }
    }

    /**
     * Build checkbox elements for entitlement
     */
    buildEntitlementList() {
        const arr = this.entitlementList.map((entitlementOption: any) => {
            return this.formBuilder.control(entitlementOption.selected);
        });
        return this.formBuilder.array(arr);
    }

    /**
     * Build checkbox for sub tab on administrations
     */
    buildSubEntitlementList() {
        const arr = this.administrationEntitlementList.map((entitlementOption: any) => {
            return this.formBuilder.control(entitlementOption.selected);
        });
        return this.formBuilder.array(arr);
    }

    /**
     * Build entitlement updation form
     */
    buildEntitlementForm() {
        this.entitlementForm = this.formBuilder.group({
            request_ticket_id: this.request_ticket_id,
            roleList: ['', ''],
            entitlement: this.buildEntitlementList(),
            administrationEntitlement: this.buildSubEntitlementList(),
            comment: this.comment
        });
    }

    buildManageUserForm() {
        this.manageUserForm = this.formBuilder.group({
            userIdInput: ['', Validators.required]
        });
    }
}
