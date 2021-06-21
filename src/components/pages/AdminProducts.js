import React, { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { v4 } from "uuid"
import { addAccount, deleteAccount, editAccount } from "../../redux/actions"
import { Table, Popconfirm, Form, Typography, Button, Select } from "antd"
import EditableCell from "./EditableCell"

const AdminUser = () => {
  const { Option } = Select
  const dispatch = useDispatch()
  const products = useSelector((store) => store.products)

  const [form] = Form.useForm()
  const [editingKey, setEditingKey] = useState("")
  const [role, setRole] = useState(null)
  const isEditing = (record) => record.id === editingKey

  const edit = (record) => {
    form.setFieldsValue({
      name: "",
      username: "",
      password: "",
      role: role,
      ...record,
    })
    setEditingKey(record.id)
  }

  const cancel = async () => {
    setEditingKey("")
  }

  const save = async (id) => {
    const row = await form.validateFields()
    console.log(row)
    dispatch(editAccount({ row: { ...row, role: role }, id }))
    setEditingKey("")
  }

  const deleteRecord = (record) => {
    dispatch(deleteAccount(record))
  }

  const addNewAccount = () => {
    const newAccount = {
      id: v4(),
      name: "",
      role: null,
      username: "",
      password: "",
    }

    dispatch(addAccount(newAccount))
    edit(newAccount)
  }

  const changeRole = (value) => {
    setRole(value)
  }

  const columns = [
    {
      title: "id",
      dataIndex: "id",
      editable: false,
      width: 150,
    },
    {
      title: "tên",
      dataIndex: "name",
      editable: true,
    },
    {
      title: "loại",
      dataIndex: "type",
      editable: true,
    },
    {
      title: "giá",
      dataIndex: "price",
      editable: true,
    },
    {
      title: "discount",
      dataIndex: "discount",
      editable: true,
    },
    {
      title: "số lượng còn lại",
      dataIndex: "remains",
      editable: true,
    },
    {
      title: "Tính năng",
      dataIndex: "operation",
      render: (_, record) => {
        const editable = isEditing(record)
        return editable ? (
          <span>
            <Button
              type="primary"
              onClick={() => save(record.id)}
              style={{
                marginRight: 8,
              }}
            >
              Lưu
            </Button>

            <Popconfirm title="Bạn muốn hủy?" onConfirm={cancel}>
              <Button>Hủy</Button>
            </Popconfirm>
          </span>
        ) : (
          <>
            <Typography.Link
              disabled={editingKey !== ""}
              onClick={() => edit(record)}
            >
              Sửa
            </Typography.Link>

            <Popconfirm
              title="Bạn có chắc XÓA tài khoản?"
              onConfirm={() => deleteRecord(record)}
            >
              <Typography.Link
                disabled={editingKey !== ""}
                type="danger"
                style={{ marginLeft: "25px" }}
              >
                Xóa
              </Typography.Link>
            </Popconfirm>
          </>
        )
      },
    },
  ]

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col
    }

    return {
      ...col,
      onCell: (record) => ({
        record,
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    }
  })

  return (
    <>
      <Button onClick={addNewAccount} type="primary">
        Thêm tài khoản mới
      </Button>

      <Form form={form} component={false}>
        <Table
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          dataSource={products}
          columns={mergedColumns}
          rowClassName="editable-row"
          bordered
          pagination={false}
        />
      </Form>
    </>
  )
}

export default AdminUser