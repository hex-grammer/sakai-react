/* eslint-disable @next/next/no-img-element */
'use client';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { FileUpload } from 'primereact/fileupload';
import { InputNumber, InputNumberValueChangeEvent } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { RadioButton, RadioButtonChangeEvent } from 'primereact/radiobutton';
import { Rating } from 'primereact/rating';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { classNames } from 'primereact/utils';
import React, { useEffect, useRef, useState } from 'react';
import { Demo } from '@/types';
import { MenuService } from '@/demo/service/MenuService';

/* @todo Used 'as any' for types here. Will fix in next version due to onSelectionChange event type issue. */
const Crud = () => {
    let emptyMenu: Demo.Menu = {
        label: '',
        icon: '',
        to: ''
    };

    const [menus, setMenus] = useState(null);
    const [menuDialog, setMenuDialog] = useState(false);
    const [deleteMenuDialog, setDeleteMenuDialog] = useState(false);
    const [deleteMenusDialog, setDeleteMenusDialog] = useState(false);
    const [menu, setMenu] = useState<Demo.Menu>(emptyMenu);
    const [selectedMenus, setSelectedMenus] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState('');
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<any>>(null);

    useEffect(() => {
        MenuService.getMenus().then((data) => setMenus(data as any));
    }, []);

    const formatCurrency = (value: number) => {
        return value.toLocaleString('en-US', {
            style: 'currency',
            currency: 'IDR'
        });
    };

    const openNew = () => {
        setMenu(emptyMenu);
        setSubmitted(false);
        setMenuDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setMenuDialog(false);
    };

    const hideDeleteMenuDialog = () => {
        setDeleteMenuDialog(false);
    };

    const hideDeleteMenusDialog = () => {
        setDeleteMenusDialog(false);
    };

    const saveMenu = () => {
        setSubmitted(true);

        // if (menu.name.trim()) {
        //     let _menus = [...(menus as any)];
        //     let _menu = { ...menu };
        //     if (menu.id) {
        //         const index = findIndexById(menu.id);

        //         _menus[index] = _menu;
        //         toast.current?.show({
        //             severity: 'success',
        //             summary: 'Successful',
        //             detail: 'Menu Updated',
        //             life: 3000
        //         });
        //     } else {
        //         _menu.id = createId();
        //         _menu.image = 'menu-placeholder.svg';
        //         _menus.push(_menu);
        //         toast.current?.show({
        //             severity: 'success',
        //             summary: 'Successful',
        //             detail: 'Menu Created',
        //             life: 3000
        //         });
        //     }

        //     setMenus(_menus as any);
        //     setMenuDialog(false);
        //     setMenu(emptyMenu);
        // }
    };

    const editMenu = (menu: Demo.Menu) => {
        setMenu({ ...menu });
        setMenuDialog(true);
    };

    const confirmDeleteMenu = (menu: Demo.Menu) => {
        setMenu(menu);
        setDeleteMenuDialog(true);
    };

    const deleteMenu = () => {
        let _menus = (menus as any)?.filter((val: any) => val.to !== menu.to);
        setMenus(_menus);
        setDeleteMenuDialog(false);
        setMenu(emptyMenu);
        toast.current?.show({
            severity: 'success',
            summary: 'Successful',
            detail: 'Menu Deleted',
            life: 3000
        });
    };

    const findIndexById = (id: string) => {
        let index = -1;
        for (let i = 0; i < (menus as any)?.length; i++) {
            if ((menus as any)[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    };

    const createId = () => {
        let id = '';
        let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < 5; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return id;
    };

    const exportCSV = () => {
        dt.current?.exportCSV();
    };

    const confirmDeleteSelected = () => {
        setDeleteMenusDialog(true);
    };

    const deleteSelectedMenus = () => {
        let _menus = (menus as any)?.filter((val: any) => !(selectedMenus as any)?.includes(val));
        setMenus(_menus);
        setDeleteMenusDialog(false);
        setSelectedMenus(null);
        toast.current?.show({
            severity: 'success',
            summary: 'Successful',
            detail: 'Menus Deleted',
            life: 3000
        });
    };

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, name: string) => {
        const val = (e.target && e.target.value) || '';
        let _menu = { ...menu };
        // _menu[`${name}`] = val;

        setMenu(_menu);
    };

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="New" icon="pi pi-plus" severity="success" className=" mr-2" onClick={openNew} />
                    <Button label="Delete" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedMenus || !(selectedMenus as any).length} />
                </div>
            </React.Fragment>
        );
    };

    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                <FileUpload mode="basic" accept="image/*" maxFileSize={1000000} chooseLabel="Import" className="mr-2 inline-block" />
                <Button label="Export" icon="pi pi-upload" severity="help" onClick={exportCSV} />
            </React.Fragment>
        );
    };

    const actionBodyTemplate = (rowData: Demo.Menu) => {
        return (
            <>
                <Button icon="pi pi-pencil" rounded severity="success" className="mr-2" onClick={() => editMenu(rowData)} />
                <Button icon="pi pi-trash" rounded severity="warning" onClick={() => confirmDeleteMenu(rowData)} />
            </>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Manage Menus</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.currentTarget.value)} placeholder="Search..." />
            </span>
        </div>
    );

    const menuDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" text onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" text onClick={saveMenu} />
        </>
    );
    const deleteMenuDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideDeleteMenuDialog} />
            <Button label="Yes" icon="pi pi-check" text onClick={deleteMenu} />
        </>
    );
    const deleteMenusDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideDeleteMenusDialog} />
            <Button label="Yes" icon="pi pi-check" text onClick={deleteSelectedMenus} />
        </>
    );

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                    <DataTable
                        ref={dt}
                        value={menus}
                        selection={selectedMenus}
                        onSelectionChange={(e) => setSelectedMenus(e.value as any)}
                        dataKey="id"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} menus"
                        globalFilter={globalFilter}
                        emptyMessage="No menus found."
                        header={header}
                    >
                        <Column field="label" header="Label" />
                        <Column field="to" header="To" />
                        <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                    </DataTable>

                    {/* <Dialog visible={menuDialog} style={{ width: '450px' }} header="Menu Details" modal className="p-fluid" footer={menuDialogFooter} onHide={hideDialog}>
                        {menu.image && <img src={`/demo/images/menu/${menu.image}`} alt={menu.image} width="150" className="mt-0 mx-auto mb-5 block shadow-2" />}
                        <div className="field">
                            <label htmlFor="name">Name</label>
                            <InputText
                                id="name"
                                value={menu.name}
                                onChange={(e) => onInputChange(e, 'name')}
                                required
                                autoFocus
                                className={classNames({
                                    'p-invalid': submitted && !menu.name
                                })}
                            />
                            {submitted && !menu.name && <small className="p-invalid">Name is required.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="description">Description</label>
                            <InputTextarea id="description" value={menu.description} onChange={(e) => onInputChange(e, 'description')} required rows={3} cols={20} />
                        </div>

                        <div className="field">
                            <label className="mb-3">Category</label>
                            <div className="formgrid grid">
                                <div className="field-radiobutton col-6">
                                    <RadioButton inputId="category1" name="category" value="Accessories" onChange={onCategoryChange} checked={menu.category === 'Accessories'} />
                                    <label htmlFor="category1">Accessories</label>
                                </div>
                                <div className="field-radiobutton col-6">
                                    <RadioButton inputId="category2" name="category" value="Clothing" onChange={onCategoryChange} checked={menu.category === 'Clothing'} />
                                    <label htmlFor="category2">Clothing</label>
                                </div>
                                <div className="field-radiobutton col-6">
                                    <RadioButton inputId="category3" name="category" value="Electronics" onChange={onCategoryChange} checked={menu.category === 'Electronics'} />
                                    <label htmlFor="category3">Electronics</label>
                                </div>
                                <div className="field-radiobutton col-6">
                                    <RadioButton inputId="category4" name="category" value="Fitness" onChange={onCategoryChange} checked={menu.category === 'Fitness'} />
                                    <label htmlFor="category4">Fitness</label>
                                </div>
                            </div>
                        </div>

                        <div className="formgrid grid">
                            <div className="field col">
                                <label htmlFor="price">Price</label>
                                <InputNumber id="price" value={menu.price} onValueChange={(e) => onInputNumberChange(e, 'price')} mode="currency" currency="USD" locale="en-US" />
                            </div>
                            <div className="field col">
                                <label htmlFor="quantity">Quantity</label>
                                <InputNumber id="quantity" value={menu.quantity} onValueChange={(e) => onInputNumberChange(e, 'quantity')} />
                            </div>
                        </div>
                    </Dialog> */}

                    {/* <Dialog visible={deleteMenuDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteMenuDialogFooter} onHide={hideDeleteMenuDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {menu && (
                                <span>
                                    Are you sure you want to delete <b>{menu.name}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog> */}

                    <Dialog visible={deleteMenusDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteMenusDialogFooter} onHide={hideDeleteMenusDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {menu && <span>Are you sure you want to delete the selected menus?</span>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default Crud;
