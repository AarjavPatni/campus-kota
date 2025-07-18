import { useEffect, useState } from "react";
import supabase from "@/supabaseClient";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
  Popover,
  Button,
} from "flowbite-react";
import Link from "next/link";

export function Ledger () {
  const [ledgerData, setLedgerData] = useState([]);
  const [error, setError] = useState(null);
  const [detailedEntries, setDetailedEntries] = useState([]);
  const [showOnlyPositive, setShowOnlyPositive] = useState(true);

  useEffect(() => {
    const fetchLedgerData = async () => {
      // First get the ledger data
      const { data: ledgerData, error: ledgerError } = await supabase
        .from("ledger")
        .select("uid, type, month, year, date, total, deposit")
        .order('year', { ascending: false })
        .order('month', { ascending: false })
        .order('type', { ascending: false })
        .order('date', { ascending: false });

      if (ledgerError) {
        setError(ledgerError);
        return;
      }

      // Get student details
      const { data: studentData, error: studentError } = await supabase
        .from("student_details")
        .select("uid, first_name, original_room, active");

      if (studentError) {
        setError(studentError);
        return;
      }

      // Create a map of student details for easy lookup
      const studentMap = studentData.reduce((acc, student) => {
        acc[student.uid] = student;
        return acc;
      }, {});

      // Process the data to combine rows with same UID
      const processedData = ledgerData.reduce((acc, curr) => {
        const existingEntry = acc.find(item => item.uid === curr.uid);
        const student = studentMap[curr.uid];
        
        if (existingEntry) {
          // Sum up rent_balance and deposit
          existingEntry.total = (existingEntry.total || 0) + (curr.total || 0);
          existingEntry.deposit = (existingEntry.deposit || 0) + (curr.deposit || 0);
        } else {
          acc.push({
            uid: curr.uid,
            room_student: student ? `${student.original_room}-${student.first_name}` : 'Unknown',
            original_room: student ? student.original_room : '', // Store original_room for sorting
            active: student ? student.active : false, // Store active status for sorting
            total: curr.total || 0,
            deposit: curr.deposit || 0
          });
        }
        return acc;
      }, []);

      // Sort by active first, then by room number (original_room)
      processedData.sort((a, b) => {
        if (a.active === b.active) {
          const roomA = isNaN(Number(a.original_room)) ? a.original_room : Number(a.original_room);
          const roomB = isNaN(Number(b.original_room)) ? b.original_room : Number(b.original_room);
          if (roomA < roomB) return -1;
          if (roomA > roomB) return 1;
          return 0;
        }
        return b.active - a.active; // active students first
      });

      setLedgerData(processedData);
      setDetailedEntries(ledgerData);
    };

    fetchLedgerData();
  }, []);

  if (error) return <div>Error fetching data: {error.message}</div>;

  return (
    <div className="mx-auto max-w-screen-md">
      <div className="mx-6 sm:mx-0 mb-4 flex items-center justify-between">
        <Button
          color={showOnlyPositive ? "success" : "gray"}
          onClick={() => setShowOnlyPositive(!showOnlyPositive)}
          size="sm"
        >
          {showOnlyPositive ? "Pending Only" : "All"}
        </Button>
        <Link href="/admin" prefetch>
          <Button
            color="purple"
            size="sm"
          >
            Admin
          </Button>
        </Link>
      </div>
      <Table striped>
        <TableHead>
          <TableHeadCell>Room-Student</TableHeadCell>
          <TableHeadCell>Rent Balance</TableHeadCell>
          <TableHeadCell>Deposit</TableHeadCell>
        </TableHead>
        <TableBody className="divide-y">
          {ledgerData
            .filter(entry => !showOnlyPositive || entry.total > 0)
            .map((entry, index) => (
            <TableRow
              key={index}
              className="bg-white dark:border-gray-700 dark:bg-gray-800"
            >
              <TableCell className="whitespace-nowrap font-medium text-gray-900 hover:text-blue-500 transition-colors dark:text-white">
                <Popover
                  content={
                    <div className="border border-gray-200 dark:border-gray-700">
                      <Table striped>
                        <TableHead>
                          <TableHeadCell className="text-xs py-1">Date</TableHeadCell>
                          <TableHeadCell className="text-xs py-1">Type</TableHeadCell>
                          <TableHeadCell className="text-xs py-1">Total</TableHeadCell>
                          <TableHeadCell className="text-xs py-1">Deposit</TableHeadCell>
                        </TableHead>
                        <TableBody>
                          {detailedEntries
                            .filter(e => e.uid === entry.uid)
                            .sort((a, b) => {
                              if (b.year !== a.year) return b.year - a.year;
                              if (b.month !== a.month) return b.month - a.month;
                              if (a.type < b.type) return 1;
                              if (a.type > b.type) return -1;
                              return a.date - b.date;
                            })
                            .map((detailEntry, idx) => (
                              <TableRow key={idx}>
                                <TableCell className="text-xs py-1">{detailEntry.year + "-" + detailEntry.month}</TableCell>
                                <TableCell className="text-xs py-1">{detailEntry.type}</TableCell>
                                <TableCell className="text-xs py-1">{detailEntry.total}</TableCell>
                                <TableCell className="text-xs py-1">{detailEntry.deposit}</TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                    </div>
                  }
                  trigger="click"
                  className=""
                >
                  <button className="text-left w-full">
                    {entry.room_student}
                  </button>
                </Popover>
              </TableCell>
              <TableCell>₹{entry.total.toLocaleString('en-IN')}</TableCell>
              <TableCell>₹{entry.deposit.toLocaleString('en-IN')}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
} 