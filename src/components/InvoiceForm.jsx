import React, { useState } from 'react';
import axios from 'axios';

const InvoiceForm = () => {
  const [customer, setCustomer] = useState('');
  const [billingAddress, setBillingAddress] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState('INV001');
  const [invoiceDate, setInvoiceDate] = useState('');
  const [stateOfSupply, setStateOfSupply] = useState('');
  const [items, setItems] = useState([
    { itemName: '', quantity: 0, unitPrice: 0, discount: 0, tax: 0, totalBeforeTax: 0, totalAfterTax: 0 }
  ]);

  const [summary, setSummary] = useState({
    totalAmountBeforeTax: 0,
    totalTax: 0,
    roundOff: 0,
    finalTotal: 0,
  });

  const addItem = () => {
    setItems([...items, { itemName: '', quantity: 0, unitPrice: 0, discount: 0, tax: 0 }]);
  };

  const handleItemChange = (index, event) => {
    const updatedItems = [...items];
    updatedItems[index][event.target.name] = event.target.value;
    updatedItems[index].totalBeforeTax = (updatedItems[index].quantity * updatedItems[index].unitPrice) - updatedItems[index].discount;
    updatedItems[index].totalAfterTax = updatedItems[index].totalBeforeTax + (updatedItems[index].totalBeforeTax * updatedItems[index].tax / 100);
    setItems(updatedItems);
    calculateSummary(updatedItems);
  };

  const calculateSummary = (items) => {
    const totalAmountBeforeTax = items.reduce((acc, item) => acc + item.totalBeforeTax, 0);
    const totalTax = items.reduce((acc, item) => acc + (item.totalBeforeTax * item.tax / 100), 0);
    const roundOff = Math.round(totalAmountBeforeTax + totalTax);
    const finalTotal = totalAmountBeforeTax + totalTax;

    setSummary({ totalAmountBeforeTax, totalTax, roundOff, finalTotal });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const invoiceData = {
        customer,
        billingAddress,
        invoiceNumber,
        invoiceDate,
        stateOfSupply,
        items,
        ...summary,
      };
      await axios.post('/api/invoice/create', invoiceData);
      alert('Invoice created successfully');
    } catch (error) {
      console.error('Error creating invoice', error);
    }
  };

  return (
   <>
   <h1 className='text-center py-4'>Billing Form</h1>
      <form onSubmit={handleSubmit} className="container">
    <div className="mb-3 row">
      <label className="col-sm-2 col-form-label">Customer:</label>
      <div className="col-sm-10">
        <input 
          type="text" 
          className="form-control" 
          value={customer} 
          onChange={(e) => setCustomer(e.target.value)} 
          placeholder="Enter customer name" 
        />
      </div>
    </div>
  
    <div className="mb-3 row">
      <label className="col-sm-2 col-form-label">Billing Address:</label>
      <div className="col-sm-10">
        <input 
          type="text" 
          className="form-control" 
          value={billingAddress} 
          onChange={(e) => setBillingAddress(e.target.value)} 
          placeholder="Enter billing address" 
        />
      </div>
    </div>

    <div className="mb-3 row">
      <label className="col-sm-2 col-form-label">Phone</label>
      <div className="col-sm-10">
        <input 
          type="number" 
          className="form-control" 
          placeholder="Enter phone number" 
        />
      </div>
    </div>
  
    <div className="mb-3 row">
      <label className="col-sm-2 col-form-label">Invoice Number: {invoiceNumber}</label>
    </div>
    <div className="mb-3 row">
      <label className="col-sm-2 col-form-label">Invoice Date:</label>
      <div className="col-sm-10">
        <input 
          type="date" 
          className="form-control" 
          value={invoiceDate} 
          onChange={(e) => setInvoiceDate(e.target.value)} 
        />
      </div>
    </div>
    <div className="mb-3 row">
      <label className="col-sm-2 col-form-label">State of Supply:</label>
      <div className="col-sm-10">
        <select 
          className="form-select" 
          value={stateOfSupply} 
          onChange={(e) => setStateOfSupply(e.target.value)}
        >
          <option value="State1">State 1</option>
          <option value="State2">State 2</option>
        </select>
      </div>
    </div>
  
    <div className="table-responsive">
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Item Name</th>
            <th>Quantity</th>
            <th>Unit Price</th>
            <th>Discount (%)</th>
            <th>Tax (%)</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={index}>
              <td>
                <input 
                  type="text" 
                  className="form-control" 
                  name="itemName" 
                  value={item.itemName} 
                  onChange={(e) => handleItemChange(index, e)} 
                  placeholder="Item Name" 
                />
              </td>
              <td>
                <input 
                  type="number" 
                  className="form-control" 
                  name="quantity" 
                  value={item.quantity} 
                  onChange={(e) => handleItemChange(index, e)} 
                  placeholder="Quantity" 
                />
              </td>
              <td>
                <input 
                  type="number" 
                  className="form-control" 
                  name="unitPrice" 
                  value={item.unitPrice} 
                  onChange={(e) => handleItemChange(index, e)} 
                  placeholder="Unit Price" 
                />
              </td>
              <td>
                <input 
                  type="number" 
                  className="form-control" 
                  name="discount" 
                  value={item.discount} 
                  onChange={(e) => handleItemChange(index, e)} 
                  placeholder="Discount (%)" 
                />
              </td>
              <td>
                <input 
                  type="number" 
                  className="form-control" 
                  name="tax" 
                  value={item.tax} 
                  onChange={(e) => handleItemChange(index, e)} 
                  placeholder="Tax (%)" 
                />
              </td>
              <td>
                <button 
                  type="button" 
                  className="btn btn-danger" 
                  onClick={() => removeItem(index)}
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  
    <div className="mb-3">
      <button type="button" className="btn btn-primary" onClick={addItem}>Add Item</button>
    </div>
  
    <div className="mb-3 row">
      <label className="col-sm-3">Total Amount (Before Tax): {summary.totalAmountBeforeTax}</label>
      <label className="col-sm-3">Total Tax: {summary.totalTax}</label>
      <label className="col-sm-3">Round Off: {summary.roundOff}</label>
      <label className="col-sm-3">Final Total: {summary.finalTotal}</label>
    </div>
  
    <div className="mb-3">
      <button type="submit" className="btn btn-success">Submit Invoice</button>
    </div>
  </form>
   </>

  );
};

export default InvoiceForm;