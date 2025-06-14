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

export function Ledger () {
  const [ledgerData, setLedgerData] = useState([]);
  const [error, setError] = useState(null);
  const [selectedUid, setSelectedUid] = useState(null);
  const [detailedEntries, setDetailedEntries] = useState([]);
  const [showOnlyPositive, setShowOnlyPositive] = useState(true);

  useEffect(() => {
    const fetchLedgerData = async () => {
      // First get the ledger data
      const { data: ledgerData, error: ledgerError } = await supabase
        .from("ledger")
        .select("uid, type, month, year, total, deposit")
        .order('year', { ascending: false })
        .order('month', { ascending: false })
        .order('type', { ascending: false });

      if (ledgerError) {
        setError(ledgerError);
        return;
      }

      // Get student details
      const { data: studentData, error: studentError } = await supabase
        .from("student_details")
        .select("uid, first_name, original_room");

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
            total: curr.total || 0,
            deposit: curr.deposit || 0
          });
        }
        return acc;
      }, []);

      setLedgerData(processedData);
      setDetailedEntries(ledgerData);
    };

    fetchLedgerData();
  }, []);

  if (error) return <div>Error fetching data: {error.message}</div>;

  return (
    <div className="mx-auto max-w-screen-md">
      <div className="mb-4 flex items-center justify-between">
        <Button
          color={showOnlyPositive ? "success" : "gray"}
          onClick={() => setShowOnlyPositive(!showOnlyPositive)}
          size="sm"
        >
          {showOnlyPositive ? "Pending Only" : "All"}
        </Button>
        <Button
          href="/admin"
          color="purple"
          size="sm"
        >
          Admin
        </Button>
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
              <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                <Popover
                  content={
                    <div>
                      <Table striped>
                        <TableHead>
                          <TableHeadCell className="text-xs py-1">Year</TableHeadCell>
                          <TableHeadCell className="text-xs py-1">Month</TableHeadCell>
                          <TableHeadCell className="text-xs py-1">Type</TableHeadCell>
                          <TableHeadCell className="text-xs py-1">Total</TableHeadCell>
                          <TableHeadCell className="text-xs py-1">Deposit</TableHeadCell>
                        </TableHead>
                        <TableBody>
                          {detailedEntries
                            .filter(e => e.uid === entry.uid)
                            .map((detailEntry, idx) => (
                              <TableRow key={idx}>
                                <TableCell className="text-xs py-1">{detailEntry.year}</TableCell>
                                <TableCell className="text-xs py-1">{detailEntry.month}</TableCell>
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
                >
                  <button className="text-left w-full">
                    {entry.room_student}
                  </button>
                </Popover>
              </TableCell>
              <TableCell>{entry.total}</TableCell>
              <TableCell>{entry.deposit}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
} 