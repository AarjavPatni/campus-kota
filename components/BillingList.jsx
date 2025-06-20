import { useEffect, useState, useRef } from "react";
import supabase from "@/supabaseClient";
import Link from "next/link";
import BillingForm from "./BillingForm";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
  Button,
  Spinner,
} from "flowbite-react";
import CollectionForm from "./CollectionForm";
import { BillGenerator } from "./BillGenerator";

export function BillingList() {
  const [billingDetails, setBillingDetails] = useState([]);
  const [studentDetailsMap, setStudentDetailsMap] = useState({});
  const [error, setError] = useState(null);
  const [selectedBillKey, setSelectedBillKey] = useState(null);
  const [selectedUID, setSelectedUID] = useState(null);
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  
  // New state for editing
  const [editingCell, setEditingCell] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [updateError, setUpdateError] = useState(null);
  const editInputRef = useRef(null);

  useEffect(() => {
    const fetchBillDetails = async () => {
      let { data, error } = await supabase
        .from("billing")
        .select("bill_key,uid,room_name,monthly_rent,electricity_charge,laundry_charge,other_charge,year,month,bill_date,approved")
        .eq("year", year)
        .eq("month", month);

      if (error) {
        setError(error);
      } else {
        setBillingDetails(data);
        // Fetch student details for all bills
        const uniqueUids = [...new Set(data.map(bill => bill.uid))];
        const studentDetails = {};
        
        for (const uid of uniqueUids) {
          const { data: studentData, error: studentError } = await supabase
            .from('student_details')
            .select('original_room, first_name')
            .eq('uid', uid)
            .single();
            
          if (!studentError && studentData) {
            studentDetails[uid] = studentData;
          }
        }
        
        setStudentDetailsMap(studentDetails);
      }
    };

    fetchBillDetails();
  }, [month, year]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (editingCell && editInputRef.current && !editInputRef.current.contains(event.target)) {
        setEditingCell(null);
        setEditValue("");
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setEditingCell(null);
        setEditValue("");
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [editingCell]);

  const handleEdit = (billKey, field, value) => {
    setEditingCell(`${billKey}-${field}`);
    setEditValue(value);
  };

  const handleSave = async (billKey, field) => {
    setLoading(true);
    setUpdateError(null);

    try {
      // Optimistic update
      const updatedBillingDetails = billingDetails.map(bill => {
        if (bill.bill_key === billKey) {
          return { ...bill, [field]: editValue };
        }
        return bill;
      });
      setBillingDetails(updatedBillingDetails);

      // Actual update
      const { error } = await supabase
        .from("billing")
        .update({ [field]: editValue })
        .eq("bill_key", billKey);

      if (error) throw error;

      setEditingCell(null);
    } catch (err) {
      setUpdateError(err.message);
      // Revert optimistic update
      const { data } = await supabase
        .from("billing")
        .select("*")
        .eq("bill_key", billKey)
        .single();
      
      if (data) {
        setBillingDetails(billingDetails.map(bill => 
          bill.bill_key === billKey ? data : bill
        ));
      }
    } finally {
      setLoading(false);
    }
  };

  if (error) return <div>Error fetching data: {error.message}</div>;

  return (
    <div>
      {selectedBillKey ? (
        <BillingForm bill_key={selectedBillKey} />
      ) : selectedUID ? (
        <CollectionForm uid={selectedUID} />
      ) : (
        <div className="mx-auto max-w-screen-md">
          <div className="mx-6 sm:mx-0 flex items-center justify-between mb-5">
            <div className="flex items-center space-x-2 w-48">
              <div className="w-18">
                <select
                  id="month"
                  name="month"
                  className="w-full px-2 py-2 text-sm border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                  defaultValue={new Date().getMonth() + 1}
                >
                  <option value="1">Jan</option>
                  <option value="2">Feb</option>
                  <option value="3">Mar</option>
                  <option value="4">Apr</option>
                  <option value="5">May</option>
                  <option value="6">Jun</option>
                  <option value="7">Jul</option>
                  <option value="8">Aug</option>
                  <option value="9">Sep</option>
                  <option value="10">Oct</option>
                  <option value="11">Nov</option>
                  <option value="12">Dec</option>
                </select>
              </div>

              <div className="w-1/2">
                <select
                  id="year"
                  name="year"
                  className="w-full px-2 py-2 text-sm border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                >
                  {[...Array(new Date().getFullYear() - 2010 + 1).keys()].map(
                    (i) => (
                      <option key={i} value={2010 + i}>
                        {2010 + i}
                      </option>
                    )
                  )}
                </select>
              </div>
            </div>

            <div className="flex-1 flex justify-end space-x-2">
              <BillGenerator />

              <Link href="/admin" prefetch>
                <Button
                  color="purple"
                  size="sm"
                >
                  Admin
                </Button>
              </Link>
            </div>
          </div>

          {updateError && (
            <div className="mb-4 p-4 text-red-700 bg-red-100 rounded-lg">
              {updateError}
            </div>
          )}

          <Table striped className="w-full">
            <TableHead>
              <TableHeadCell className="px-2">Room-Student</TableHeadCell>
              <TableHeadCell className="px-2">Light Charge</TableHeadCell>
              <TableHeadCell className="px-2">Laundry, Etc</TableHeadCell>
              <TableHeadCell className="px-2">Monthly Rent</TableHeadCell>
            </TableHead>
            <TableBody className="divide-y">
              {billingDetails
                .filter(bill => studentDetailsMap[bill.uid]) // Only show bills where we have student details
                .sort((a, b) => {
                  const roomA = parseInt(studentDetailsMap[a.uid].original_room) || 0;
                  const roomB = parseInt(studentDetailsMap[b.uid].original_room) || 0;
                  return roomA - roomB;
                })
                .map((bill, index) => (
                <TableRow
                  key={index}
                  className="bg-white dark:border-gray-700 dark:bg-gray-800"
                >
                  <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white px-2">
                    {studentDetailsMap[bill.uid] 
                      ? `${studentDetailsMap[bill.uid].original_room}-${studentDetailsMap[bill.uid].first_name}`
                      : 'Loading...'}
                  </TableCell>
                  <TableCell className="relative px-2">
                    {editingCell === `${bill.bill_key}-electricity_charge` ? (
                      <div ref={editInputRef} className="absolute inset-0 flex items-center space-x-2 bg-white z-10">
                        <input
                          type="number"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              handleSave(bill.bill_key, 'electricity_charge');
                            }
                          }}
                          className="w-20 px-2 py-1 border rounded select-all"
                          autoFocus
                        />
                        <Button size="xs" color="success" onClick={() => handleSave(bill.bill_key, 'electricity_charge')}>
                          {loading ? <Spinner size="sm" /> : '✓'}
                        </Button>
                      </div>
                    ) : (
                      <div
                        onClick={() => handleEdit(bill.bill_key, 'electricity_charge', bill.electricity_charge)}
                        className="cursor-pointer hover:bg-gray-100 p-1 rounded"
                      >
                        {bill.electricity_charge}
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="relative px-2">
                    {editingCell === `${bill.bill_key}-laundry_charge` ? (
                      <div ref={editInputRef} className="absolute inset-0 flex items-center space-x-2 bg-white z-10">
                        <input
                          type="number"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              handleSave(bill.bill_key, 'laundry_charge');
                            }
                          }}
                          className="w-20 px-2 py-1 border rounded select-all"
                          autoFocus
                        />
                        <Button size="xs" color="success" onClick={() => handleSave(bill.bill_key, 'laundry_charge')}>
                          {loading ? <Spinner size="sm" /> : '✓'}
                        </Button>
                      </div>
                    ) : (
                      <div
                        onClick={() => handleEdit(bill.bill_key, 'laundry_charge', bill.laundry_charge)}
                        className="cursor-pointer hover:bg-gray-100 p-1 rounded"
                      >
                        {bill.laundry_charge}
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="relative px-2">
                    {editingCell === `${bill.bill_key}-monthly_rent` ? (
                      <div ref={editInputRef} className="absolute inset-0 flex items-center space-x-2 bg-white z-10">
                        <input
                          type="number"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              handleSave(bill.bill_key, 'monthly_rent');
                            }
                          }}
                          className="w-20 px-2 py-1 border rounded select-all"
                          autoFocus
                        />
                        <Button size="xs" color="success" onClick={() => handleSave(bill.bill_key, 'monthly_rent')}>
                          {loading ? <Spinner size="sm" /> : '✓'}
                        </Button>
                      </div>
                    ) : (
                      <div
                        onClick={() => handleEdit(bill.bill_key, 'monthly_rent', bill.monthly_rent)}
                        className="cursor-pointer hover:bg-gray-100 p-1 rounded"
                      >
                        {bill.monthly_rent}
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
