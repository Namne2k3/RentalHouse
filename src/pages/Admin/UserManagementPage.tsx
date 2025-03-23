import { DeleteOutlined, EditOutlined, UserAddOutlined } from '@ant-design/icons';
import { QueryClient, useMutation, useQuery } from '@tanstack/react-query';
import { Button, Form, Input, Modal, Select, Space, Table, Tag, message } from 'antd';
import { useState } from 'react';
import api from '../../services/api';

interface User {
    id: number;
    fullName: string;
    email: string;
    phoneNumber?: string;
    role: string;
    dateRegistered: string;
}

const UserManagementPage = () => {
    const [form] = Form.useForm();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const queryClient = new QueryClient();

    // Fetch users
    const { data: users, isLoading } = useQuery({
        queryKey: ['users'],
        queryFn: async () => {
            const response = await api.get('/User/getAllUsers');
            return response.data;
        },
        initialData: [],
    });

    // Create user mutation
    const createUser = useMutation({
        mutationFn: (userData: Partial<User>) => api.post('/User', userData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            message.success('Tạo người dùng thành công');
            handleModalClose();
        },
        onError: () => message.error('Có lỗi xảy ra khi tạo người dùng')
    });

    // Update user mutation
    const updateUser = useMutation({
        mutationFn: (userData: Partial<User>) =>
            api.put(`/User/${userData.id}`, userData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            message.success('Cập nhật người dùng thành công');
            handleModalClose();
        },
        onError: () => message.error('Có lỗi xảy ra khi cập nhật người dùng')
    });

    // Delete user mutation
    const deleteUser = useMutation({
        mutationFn: (id: number) => api.delete(`/User/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            message.success('Xóa người dùng thành công');
        },
        onError: () => message.error('Có lỗi xảy ra khi xóa người dùng')
    });

    const columns = [
        {
            title: 'Thao tác',
            key: 'action',
            render: (_: any, record: User) => (
                <Space size="middle">
                    <Button
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(record)}
                    />
                    <Button
                        icon={<DeleteOutlined />}
                        danger
                        onClick={() => handleDelete(record.id)}
                    />
                </Space>
            ),
        },
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Họ tên',
            dataIndex: 'fullName',
            key: 'fullName',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phoneNumber',
            key: 'phoneNumber',
        },
        {
            title: 'Vai trò',
            dataIndex: 'role',
            key: 'role',
            render: (role: string) => (
                <Tag color={role === 'Admin' ? 'red' : 'green'}>
                    {role}
                </Tag>
            ),
        },
        {
            title: 'Ngày đăng ký',
            dataIndex: 'dateRegistered',
            key: 'dateRegistered',
            render: (date: string) => new Date(date).toLocaleDateString(),
        },
    ];

    const handleModalClose = () => {
        setIsModalVisible(false);
        setEditingUser(null);
        form.resetFields();
    };

    const handleEdit = (user: User) => {
        setEditingUser(user);
        form.setFieldsValue(user);
        setIsModalVisible(true);
    };

    const handleDelete = (id: number) => {
        Modal.confirm({
            title: 'Xác nhận xóa',
            content: 'Bạn có chắc chắn muốn xóa người dùng này?',
            onOk: () => deleteUser.mutate(id),
        });
    };

    const handleSubmit = async (values: any) => {
        if (editingUser) {
            updateUser.mutate({ ...values, id: editingUser.id });
        } else {
            createUser.mutate(values);
        }
    };

    return (
        <div>
            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
                <h2>Quản lý người dùng</h2>
                <Button
                    type="primary"
                    icon={<UserAddOutlined />}
                    onClick={() => setIsModalVisible(true)}
                >
                    Thêm người dùng
                </Button>
            </div>

            <Table
                columns={columns}
                dataSource={users.data || []}
                loading={isLoading}
                rowKey="id"
            />

            <Modal
                title={editingUser ? "Sửa người dùng" : "Thêm người dùng"}
                open={isModalVisible}
                onCancel={handleModalClose}
                footer={null}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                >
                    <Form.Item
                        name="fullName"
                        label="Họ tên"
                        rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="email"
                        label="Email"
                        rules={[
                            { required: true, message: 'Vui lòng nhập email!' },
                            { type: 'email', message: 'Email không hợp lệ!' }
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="phoneNumber"
                        label="Số điện thoại"
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="role"
                        label="Vai trò"
                        rules={[{ required: true, message: 'Vui lòng chọn vai trò!' }]}
                    >
                        <Select>
                            <Select.Option value="Admin">Admin</Select.Option>
                            <Select.Option value="User">User</Select.Option>
                        </Select>
                    </Form.Item>

                    <Form.Item>
                        <Space>
                            <Button type="primary" htmlType="submit">
                                {editingUser ? 'Cập nhật' : 'Thêm mới'}
                            </Button>
                            <Button onClick={handleModalClose}>Hủy</Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default UserManagementPage;