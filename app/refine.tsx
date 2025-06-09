import { Refine } from "@refinedev/core";
import { RefineKbarProvider } from "@refinedev/kbar";
import { dataProvider } from "@refinedev/supabase";
import supabase from "../supabaseClient";
import { notificationProvider } from "@refinedev/antd";
import { AntdInferencer } from "@refinedev/inferencer/antd";

export const RefineProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <RefineKbarProvider>
      <Refine
        dataProvider={dataProvider(supabase)}
        notificationProvider={notificationProvider}
        resources={[
          {
            name: "student_details",
            list: "/admin/students",
            show: "/admin/students/show/:id",
            create: "/admin/students/create",
            edit: "/admin/students/edit/:id",
          },
        ]}
        options={{
          syncWithLocation: true,
          warnWhenUnsavedChanges: true,
        }}
      >
        {children}
      </Refine>
    </RefineKbarProvider>
  );
}; 