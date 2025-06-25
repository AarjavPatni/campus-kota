import { useEffect, useState } from "react";
import supabase from "@/supabaseClient";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
} from "flowbite-react";
import CollectionForm from "./CollectionForm";
import { Button } from "flowbite-react";

export function CollectionList() {
  const [collectionList, setCollectionList] = useState([]);
  const [error, setError] = useState(null);
  const [selectedInvoiceKey, setSelectedInvoiceKey] = useState(null);
  const [selectedUID, setSelectedUID] = useState(null);
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [room_name, setRoomName] = useState("");
  const [rooms, setRooms] = useState([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [paymentTotals, setPaymentTotals] = useState({});

  useEffect(() => {
    const fetchCollectionDetails = async () => {
      // Fetch collection data with joined student_details
      let { data: collectionData, error: collectionError } = room_name
        ? await supabase
            .from("collection")
            .select(`invoice_key,uid,room_name,monthly_charge,security_deposit,year,month,payment_date,total_amount,approved,payment_method,student_details(original_room,first_name)`)
            .eq("year", year)
            .eq("month", month)
            .eq("room_name", room_name)
        : await supabase
            .from("collection")
            .select(`invoice_key,uid,room_name,monthly_charge,security_deposit,year,month,payment_date,total_amount,approved,payment_method,student_details(original_room,first_name)`)
            .eq("year", year)
            .eq("month", month);

      if (collectionError) {
        setError(collectionError);
        return;
      }

      // Sort using the joined student_details
      const sortedData = collectionData.sort((a, b) => {
        const aDetails = a.student_details || { original_room: '', first_name: '' };
        const bDetails = b.student_details || { original_room: '', first_name: '' };

        // Sort by original_room (numeric if possible)
        const roomA = isNaN(Number(aDetails.original_room)) ? aDetails.original_room : Number(aDetails.original_room);
        const roomB = isNaN(Number(bDetails.original_room)) ? bDetails.original_room : Number(bDetails.original_room);
        if (roomA < roomB) return -1;
        if (roomA > roomB) return 1;

        // If room is same, sort by first_name
        if (aDetails.first_name < bDetails.first_name) return -1;
        if (aDetails.first_name > bDetails.first_name) return 1;
        // If still same, sort by payment_date (descending)
        return new Date(b.payment_date) - new Date(a.payment_date);
      });

      setCollectionList(sortedData);
      setPaymentTotals(
        collectionData.reduce((totals, invoice) => {
          totals[invoice.payment_method] =
            (totals[invoice.payment_method] || 0) + invoice.total_amount;
          return totals;
        }, {})
      );

      if (rooms.length === 0) {
        setRooms([...new Set(collectionData.map((invoice) => invoice.room_name))]);
      }
    };

    fetchCollectionDetails();
  }, [month, year, room_name, refreshTrigger]);

  if (error) return <div>Error fetching data: {error.message}</div>;

  return (
    <div>
      {selectedInvoiceKey ? (
        <CollectionForm
          uid={selectedUID}
          invoice_key={selectedInvoiceKey}
          returnToBill={false}
          onSuccess={() => setRefreshTrigger((prev) => prev + 1)}
        />
      ) : selectedUID ? (
        <CollectionForm uid={selectedUID} invoice_key={selectedInvoiceKey} />
      ) : (
        <div className="mx-auto max-w-screen-md">
          <div className="flex items-center justify-between mb-5 mx-6 sm:mx-0">
            <div className="flex items-center gap-4">
              <div className="w-20">
                <select
                  id="month"
                  name="month"
                  className="block w-full px-3 py-2 text-base border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                  defaultValue={new Date().getMonth() + 1}
                >
                  {Array.from({length: 12}, (_, i) => 
                    <option key={i+1} value={i+1}>{new Date(0, i).toLocaleString('default', {month: 'short'})}</option>
                  )}
                </select>
              </div>

              <div>
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

            <Link href="/admin" prefetch>
              <Button
                color="purple"
                size="sm"
              >
                Admin
              </Button>
            </Link>
          </div>

          {/* Card view for mobile */}
          <div className="block md:hidden space-y-2">
            {collectionList.map((invoice, index) => (
              <div
                key={index}
                className="bg-white text-black rounded-md shadow flex items-center justify-between px-3 py-2 max-w-xs mx-auto cursor-pointer"
                onClick={() => {
                  setSelectedInvoiceKey(invoice.invoice_key);
                  setSelectedUID(invoice.uid);
                }}
              >
                {/* Left: Name and Date */}
                <div className="flex flex-col justify-center">
                  <span className="text-base font-semibold text-blue-700">
                    {invoice.student_details ? `${invoice.student_details.original_room}-${invoice.student_details.first_name}` : 'Loading...'}
                  </span>
                  <span className="text-sm text-gray-600">
                    {new Date(invoice.payment_date).toLocaleDateString('en-GB')}
                  </span>
                </div>
                {/* Right: Amount and Payment Type */}
                <div className="flex flex-col items-end">
                  <span className="text-base font-semibold">₹{invoice.total_amount.toLocaleString('en-IN')}</span>
                  <span className="text-sm text-gray-600">{invoice.payment_method}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Table view for desktop */}
          <div className="overflow-x-auto w-full hidden md:block">
            <Table striped className="min-w-[600px]">
              <TableHead>
                <TableHeadCell>Room-Student</TableHeadCell>
                <TableHeadCell>Payment Date</TableHeadCell>
                <TableHeadCell>Total Amount</TableHeadCell>
                <TableHeadCell>Payment Method</TableHeadCell>
                <TableHeadCell>
                  <span className="sr-only">Edit</span>
                </TableHeadCell>
              </TableHead>
              <TableBody className="divide-y">
                {collectionList.map((invoice, index) => (
                  <TableRow
                    key={index}
                    className="bg-white dark:border-gray-700 dark:bg-gray-800"
                  >
                    <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                      {invoice.student_details 
                        ? `${invoice.student_details.original_room}-${invoice.student_details.first_name}`
                        : 'Loading...'}
                    </TableCell>
                    <TableCell>{new Date(invoice.payment_date).toLocaleDateString('en-GB')}</TableCell>
                    <TableCell>{invoice.total_amount}</TableCell>
                    <TableCell>{invoice.payment_method}</TableCell>
                    <TableCell>
                      <Link
                        href="#"
                        onClick={() => {
                          console.log(invoice.invoice_key);
                          setSelectedInvoiceKey(invoice.invoice_key);
                          setSelectedUID(invoice.uid);
                        }}
                        className="font-medium text-cyan-600 hover:underline dark:text-cyan-500"
                      >
                        Edit
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Totals by Payment Method */}
          <div className="mt-6 mx-6 sm:mx-0 overflow-hidden sm:rounded-none rounded-lg">
            <Table striped>
              <TableBody className="divide-y">
                <TableRow className="bg-gray-100 dark:bg-gray-900 font-bold">
                  <TableCell className="text-md font-bold text-center whitespace-nowrap text-gray-900 dark:text-white">
                    GRAND TOTAL
                  </TableCell>
                  <TableCell className="text-md text-center whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    ₹
                    {Math.floor(Object.values(paymentTotals)
                      .reduce((sum, total) => sum + total, 0))
                      .toLocaleString('en-IN')}
                  </TableCell>
                </TableRow>
                {Object.entries(paymentTotals).map(([method, total], index) => (
                  <TableRow
                    key={index}
                    className="text-md bg-white dark:border-gray-700 dark:bg-gray-800"
                  >
                    <TableCell className="text-md text-center font-medium text-gray-900 dark:text-white">
                      {method}
                    </TableCell>
                    <TableCell className="text-md text-center">
                      ₹{Math.floor(total).toLocaleString('en-IN')}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  );
}
