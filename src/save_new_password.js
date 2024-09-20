import React, { useState, useEffect } from 'react';
import { PlusOutlined, UserOutlined, EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { Button, Tooltip, Modal, Input, Select, message } from 'antd';
import { addPasswordItem } from './crud_operation';
import axios from './axiosConfg';
import { usePasswordContext } from './PasswordContext';

const { Option } = Select;

const SaveNewPassword = ({ groupId, userId, comment, url, onPasswordAdd }) => {
    const [open, setOpen] = useState(false);
    const [fieldName, setFieldName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [groupOptions, setGroupOptions] = useState([]);
    const [newGroupName, setNewGroupName] = useState('');
    const { addPassword } = usePasswordContext();

    useEffect(() => {
        axios.get('http://127.0.0.1:8000/api/groups/')
            .then(response => {
                setGroupOptions(response.data);
            })
            .catch(error => {
                console.error('Error fetching groups:', error);
            });
    }, []);

    const showModal = () => {
        setOpen(true);
    };

    const handleOk = () => {
        let groupIdToUse = selectedGroup;

        if (newGroupName) {
            axios.post('http://127.0.0.1:8000/api/groups/', { groupName: newGroupName, userId: userId })
                .then(response => {
                    groupIdToUse = response.data.groupId;
                    savePassword(groupIdToUse);
                })
                .catch(error => {
                    console.error('Failed to create new group:', error);
                    message.error('Failed to create new group');
                });
        } else {
            savePassword(groupIdToUse);
        }
    };

    const savePassword = (groupIdToUse) => {
        const newPasswordItem = {
            itemName: fieldName,
            userName: username,
            password: password,
            groupId: groupIdToUse,
            userId: userId,
            comment: comment,
            url: url,
        };

        addPasswordItem(newPasswordItem, groupIdToUse)
            .then((newItem) => {
                message.success('New password added successfully');
                onPasswordAdd(newItem);
                setOpen(false);
            })
            .catch((error) => {
                console.error('Error adding password:', error);
                message.error('Failed to add password');
            });
    };

    const handleCancel = () => {
        setOpen(false);
    };

    const generatePassword = () => {
        axios.post('http://127.0.0.1:8000/api/password-items/generate/', { /* any necessary payload */ })
            .then(response => {
                // Log the entire response to check its structure
                console.log('Generated password response:', response);

                // Update the password state with the correct key
                if (response.data && response.data.generated_password) {
                    setPassword(response.data.generated_password); // Update the password state to auto-fill
                    message.success('Password generated successfully');
                } else {
                    message.error('Unexpected response structure');
                }
            })
            .catch(error => {
                console.error('Error generating password:', error);
                message.error('Failed to generate password');
            });
    };

    return (
        <>
            <Tooltip title="Add new password">
                <Button
                    type="primary"
                    shape="circle"
                    icon={<PlusOutlined />}
                    onClick={showModal}
                />
            </Tooltip>

            <Modal
                title="Add New Password"
                centered
                open={open}
                onOk={handleOk}
                onCancel={handleCancel}
                width={600}
            >
                <p>Enter the new password details here...</p>

                <Input
                    placeholder="Field name"
                    value={fieldName}
                    onChange={(e) => setFieldName(e.target.value)}
                    style={{ marginBottom: '10px' }}
                />
                <Input
                    placeholder="User-name"
                    prefix={<UserOutlined />}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    style={{ marginBottom: '10px' }}
                />
                <Input.Password
                    placeholder="Input password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                    style={{ width: '45%', marginBottom: '10px' }}
                />
                <Button type="primary" style={{ width: '45%', marginBottom: '10px', marginLeft: '9.5%' }} onClick={generatePassword}>
                    Generate password
                </Button>

                <Select
                    style={{ width: '100%', marginBottom: '10px' }}
                    placeholder="Select an existing group"
                    onChange={(value) => setSelectedGroup(value)}
                >
                    {groupOptions.map((group) => (
                        <Option key={group.groupId} value={group.groupId}>
                            {group.groupName}
                        </Option>
                    ))}
                </Select>

                <Input
                    placeholder="Or enter new group name"
                    value={newGroupName}
                    onChange={(e) => setNewGroupName(e.target.value)}
                    style={{ marginBottom: '10px' }}
                />
            </Modal>
        </>
    );
};

export default SaveNewPassword;
