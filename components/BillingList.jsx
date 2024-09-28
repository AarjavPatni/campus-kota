import { useEffect, useState } from "react";
import { supabase } from "@/supabaseClient";
import Link from "next/link";
import BillingForm from "./BillingForm";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
} from "flowbite-react";
import CollectionForm from "./CollectionForm";

export function BillingList() {
  const [billingDetails, setBillingDetails] = useState([]);
  const [error, setError] = useState(null);
  const [selectedBillKey, setSelectedBillKey] = useState(null);
  const [selectedUID, setSelectedUID] = useState(null);
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);

  useEffect(() => {
    const fetchBillDetails = async () => {
      let { data, error } = await supabase
        .from("billing")
        .select("bill_key,uid,room_name,year,month,bill_date,approved")
        .eq("year", year)
        .eq("month", month);

      if (error) {
        setError(error);
      } else {
        setBillingDetails(data);
      }
    };

    fetchBillDetails();
  }, [month, year]);

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

          <Table striped>
            <TableHead>
              <TableHeadCell>Room Name</TableHeadCell>
              <TableHeadCell>Year</TableHeadCell>
              <TableHeadCell>Month</TableHeadCell>
              <TableHeadCell>
                <span className="sr-only">Edit</span>
              </TableHeadCell>
            </TableHead>
            <TableBody className="divide-y">
              {billingDetails.map((bill, index) => (
                <TableRow
                  key={index}
                  className="bg-white dark:border-gray-700 dark:bg-gray-800"
                >
                  <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    {bill.room_name}
                  </TableCell>
                  <TableCell>{bill.year}</TableCell>
                  <TableCell>{bill.month}</TableCell>
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
                    <br />
                    <Link
                      href="#"
                      onClick={() => {
                        console.log(bill.uid);
                        setSelectedUID(bill.uid);
                      }}
                      className="font-medium text-cyan-600 hover:underline dark:text-cyan-500"
                    >
                      Collect
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      ;
    </div>
  );
}
