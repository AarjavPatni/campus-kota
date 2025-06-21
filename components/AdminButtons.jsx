import { Button } from "flowbite-react";
import LogoutButton from "./LogoutButton";
import Link from 'next/link';
import { HiPlus, HiUsers, HiCurrencyDollar, HiClipboardList, HiBookOpen } from "react-icons/hi";
import { useEffect } from "react";
import { useRouter } from "next/router";

const AdminButtons = () => {
  const router = useRouter();

  // Prefetch all admin routes when component mounts
  useEffect(() => {
    // Prefetch all admin routes
    router.prefetch('/admin');
    router.prefetch('/studentList');
    router.prefetch('/billingList');
    router.prefetch('/collectionList');
    router.prefetch('/ledger');
  }, [router]);

  return (
    <div className="max-w-2xl mx-auto px-4">
      <h1 className="text-3xl font-bold text-white text-center mb-8">
        {process.env.NODE_ENV === 'development' || process.env.VERCEL_ENV === 'preview'
          ? 'Admin Portal - TEST' 
          : 'Admin Portal'}
      </h1>
      <div className="flex flex-col gap-4 mt-6">
        <div className="flex justify-center w-full">
          <Link href="/insert" prefetch className="w-full">
            <Button className="w-full flex items-center justify-center gap-x-1 text-sm text-white font-medium bg-blue-600 border border-blue-700 hover:bg-blue-700 active:bg-blue-800">
              <HiPlus className="mr-2 h-5 w-5" />
              New Student Details
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
          <Link href="/studentList" prefetch className="w-full">
            <Button className="w-full flex items-center justify-center gap-x-1 text-sm text-white font-medium bg-green-600 border border-green-700 hover:bg-green-700 active:bg-green-800">
              <HiUsers className="mr-2 h-5 w-5" />
              Student List
            </Button>
          </Link>
          <Link href="/billingList" prefetch className="w-full">
            <Button className="w-full flex items-center justify-center gap-x-1 text-sm text-white font-medium bg-yellow-600 border border-yellow-700 hover:bg-yellow-700 active:bg-yellow-800">
              <HiCurrencyDollar className="mr-2 h-5 w-5" />
              Billing List
            </Button>
          </Link>
          <Link href="/collectionList" prefetch className="w-full">
            <Button className="w-full flex items-center justify-center gap-x-1 text-sm text-white font-medium bg-red-600 border border-red-700 hover:bg-red-700 active:bg-red-800">
              <HiClipboardList className="mr-2 h-5 w-5" />
              Collection List
            </Button>
          </Link>
        </div>
        <div className="flex justify-center w-full">
          <Link href="/ledger" prefetch className="w-full">
            <Button className="w-full flex items-center justify-center gap-x-1 text-sm text-white font-medium bg-purple-600 border border-purple-700 hover:bg-purple-700 active:bg-purple-800">
              <HiBookOpen className="mr-2 h-5 w-5" />
              Ledger
            </Button>
          </Link>
        </div>
      </div>
      {process.env.NODE_ENV === 'development' || process.env.VERCEL_ENV === 'preview' && (
        <div className="mt-8 flex justify-center">
          <LogoutButton />
        </div>
      )}
    </div>
  );
};

export default AdminButtons;
