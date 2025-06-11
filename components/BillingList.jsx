import { useEffect, useState } from "react";
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

  const handleCancel = () => {
    setEditingCell(null);
    setEditValue("");
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
          <div className="flex space-x-4">
            <div className="w-1/5 mb-5">
              <select
                id="month"
                name="month"
                className="block px-3 py-2 text-base border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                defaultValue={new Date().getMonth() + 1}
              >
                <option value="1">January</option>
                <option value="2">February</option>
                <option value="3">March</option>
                <option value="4">April</option>
                <option value="5">May</option>
                <option value="6">June</option>
                <option value="7">July</option>
                <option value="8">August</option>
                <option value="9">September</option>
                <option value="10">October</option>
                <option value="11">November</option>
                <option value="12">December</option>
              </select>
            </div>

            <div className="mb-5">
              <select
                id="year"
                name="year"
                className="block px-3 py-2 text-base border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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

          {updateError && (
            <div className="mb-4 p-4 text-red-700 bg-red-100 rounded-lg">
              {updateError}
            </div>
          )}

          <Table striped>
            <TableHead>
              <TableHeadCell>Room-Student</TableHeadCell>
              <TableHeadCell>Monthly Rent</TableHeadCell>
              <TableHeadCell>Electricity</TableHeadCell>
              <TableHeadCell>Laundry</TableHeadCell>
              {/* <TableHeadCell>Total Charges</TableHeadCell>
              <TableHeadCell>
                <span className="sr-only">Edit</span>
              </TableHeadCell> */}
            </TableHead>
            <TableBody className="divide-y">
              {billingDetails.map((bill, index) => (
                <TableRow
                  key={index}
                  className="bg-white dark:border-gray-700 dark:bg-gray-800"
                >
                  <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    {studentDetailsMap[bill.uid] 
                      ? `${studentDetailsMap[bill.uid].original_room}-${studentDetailsMap[bill.uid].first_name}`
                      : 'Loading...'}
                  </TableCell>
                  <TableCell>{bill.monthly_rent}</TableCell>
                  <TableCell>
                    {editingCell === `${bill.bill_key}-electricity_charge` ? (
                      <div className="flex items-center space-x-2">
                        <input
                          type="number"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          className="w-20 px-2 py-1 border rounded"
                        />
                        <Button size="xs" onClick={() => handleSave(bill.bill_key, 'electricity_charge')}>
                          {loading ? <Spinner size="sm" /> : 'Save'}
                        </Button>
                        <Button size="xs" color="gray" onClick={handleCancel}>
                          Cancel
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
                  <TableCell>
                    {editingCell === `${bill.bill_key}-laundry_charge` ? (
                      <div className="flex items-center space-x-2">
                        <input
                          type="number"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          className="w-20 px-2 py-1 border rounded"
                        />
                        <Button size="xs" onClick={() => handleSave(bill.bill_key, 'laundry_charge')}>
                          {loading ? <Spinner size="sm" /> : 'Save'}
                        </Button>
                        <Button size="xs" color="gray" onClick={handleCancel}>
                          Cancel
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
                  {/* <TableCell>
                    {parseInt(bill.electricity_charge) + parseInt(bill.laundry_charge) + parseInt(bill.other_charge)}
                  </TableCell>
                  <TableCell>
                    <Link
                      href="#"
                      onClick={() => {
                        console.log(bill.bill_key);
                        setSelectedBillKey(bill.bill_key);
                      }}
                      className="font-medium text-cyan-600 hover:underline dark:text-cyan-500"
                    >
                      Edit
                    </Link>
                  </TableCell> */}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
