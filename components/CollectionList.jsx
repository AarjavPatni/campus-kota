import { useEffect, useState } from "react";
import { supabase } from "@/supabaseClient";
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

export function CollectionList() {
  const [collectionList, setCollectionList] = useState([]);
  const [error, setError] = useState(null);
  const [selectedInvoiceKey, setSelectedInvoiceKey] = useState(null);
  const [selectedUID, setSelectedUID] = useState(null);
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [room_name, setRoomName] = useState("");
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    const fetchCollectionDetails = async () => {
      let { data, error } = room_name
        ? await supabase
            .from("collection")
            .select(
              "invoice_key,uid,room_name,monthly_rent,electricity_charge,laundry_charge,other_charge,year,month,payment_date,total_charges,total_amount,approved"
            )
            .eq("year", year)
            .eq("month", month)
            .eq("room_name", room_name)
        : await supabase
            .from("collection")
            .select(
              "invoice_key,uid,room_name,monthly_rent,electricity_charge,laundry_charge,other_charge,year,month,payment_date,total_charges,total_amount,approved"
            )
            .eq("year", year)
            .eq("month", month);

      if (rooms.length === 0) {
        setRooms([...new Set(data.map((invoice) => invoice.room_name))]);
      }

      if (error) {
        setError(error);
      } else {
        setCollectionList(data);
      }
    };

    fetchCollectionDetails();
  }, [month, year, room_name]);

  if (error) return <div>Error fetching data: {error.message}</div>;

  return (
    <div>
      {selectedInvoiceKey ? (
        <CollectionForm invoice_key={selectedInvoiceKey} />
      ) : selectedUID ? (
        <CollectionForm uid={selectedUID} invoice_key={selectedInvoiceKey} />
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

            <div className="mb-5">
              <select
                id="room_name"
                name="room_name"
                className="block px-3 py-2 text-base border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={room_name}
                onChange={(e) => {
                  setRoomName(e.target.value);
                  console.log(e.target.value);
                }}
              >
                <option value={""}>All</option>
                {[...new Set(rooms)].map((room_name, index) => (
                  <option key={index} value={room_name}>
                    {room_name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <Table striped>
            <TableHead>
              <TableHeadCell>Room Name</TableHeadCell>
              <TableHeadCell>Monthly Rent</TableHeadCell>
              <TableHeadCell>Total Charges</TableHeadCell>
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
                    {invoice.room_name}
                  </TableCell>
                  <TableCell>{invoice.monthly_rent}</TableCell>
                  <TableCell>
                    {parseInt(invoice.electricity_charge) +
                      parseInt(invoice.laundry_charge) +
                      parseInt(invoice.other_charge)}
                  </TableCell>
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
      )}
      ;
    </div>
  );
}