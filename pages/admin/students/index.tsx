import { List, useTable } from "@refinedev/antd";
import { Table, Dropdown, Button, Switch, Space } from "antd";
import { MoreOutlined } from "@ant-design/icons";
import type { NextPage } from "next";
import AdminLayout from "../_layout";
import { useState, useEffect } from "react";

const StudentList: NextPage = () => {
  const [showActive, setShowActive] = useState(false);

  const { tableProps, setFilters } = useTable({
    resource: "student_details",
  });

  useEffect(() => {
    console.log(showActive);
    console.log(tableProps);
    if (showActive) {
      setFilters([
        {
          field: "active",
          operator: "eq",
          value: true,
        },
      ]);
    } else {
      setFilters([], "replace");
    }
  }, [showActive, setFilters]);

  const menuItems = [
    { key: "edit", label: "Edit" },
    { key: "collect", label: "Collect" },
  ];

  return (
    <AdminLayout>
      <List>
        <Space style={{ marginBottom: 16, paddingLeft: 5 }}>
          <Switch
            checked={showActive}
            onChange={setShowActive}
            checkedChildren="Active"
            unCheckedChildren="All"
          />
        </Space>
        <div style={{ width: "100%" }} className="overflow-x-auto">
          <Table
            {...tableProps}
            rowKey="uid"
            pagination={false}
            columns={[
              {
                title: "Room",
                dataIndex: "room_number",
                key: "room_number",
              },
              {
                title: "Name",
                dataIndex: "first_name",
                key: "first_name",
              },
              {
                title: "Phone",
                dataIndex: "student_mobile",
                key: "student_mobile",
              },
              {
                title: "",
                key: "actions",
                render: (_, record) => (
                  <Dropdown menu={{ items: menuItems }} trigger={["click"]}>
                    <Button type="text" icon={<MoreOutlined />} />
                  </Dropdown>
                ),
              },
            ]}
          />
        </div>
      </List>
    </AdminLayout>
  );
};

export default StudentList; 