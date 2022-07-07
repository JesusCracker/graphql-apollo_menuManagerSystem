import React, { useCallback, useState, useEffect, useRef, useContext } from 'react';
import { gql, useMutation, useQuery } from "@apollo/client";
import { Form, Input, message, Modal, Popconfirm, Button ,Dropdown,Space,Menu} from 'antd';
import { CloseCircleOutlined, EditOutlined } from '@ant-design/icons';
import { AuthContext } from "../../context/auth";
import styles from './index.less'
import LoadingData from "../../components/loading";




const FETCH_STRONGHOLDS_QUERY = gql`query getStrongholds{
    getStrongholds{
        id,
        code,
        username,
        name,
    }
}`

const CREATE_STRONGHOLD_MUTATION = gql`
    mutation createStronghold($strongholdInput: StrongholdInput!) {
        createStronghold(strongholdInput: $strongholdInput) {
            name,
            id,
            code,
            username
        }
    }
`;

const DELETE_STRONGHOLD_MUTATION = gql`
    mutation deleteStronghold($strongholdId: ID!) {
        deleteStronghold(strongholdId: $strongholdId)
    }
`;

const EDIT_STRONGHOLD_MUTATION = gql`
    mutation editStronghold($strongholdId: ID!, $strongholdInput: StrongholdInput){
        editStronghold(strongholdId: $strongholdId,strongholdInput: $strongholdInput) {
            code,
            name,
            id,
            username,
        }
    }`

const Home = (props) => {
    const [form] = Form.useForm();
    const { user, logout } = useContext(AuthContext);
    const { loading, data } = useQuery(FETCH_STRONGHOLDS_QUERY);
    const [visible, setVisible] = useState(false);
    const [formValues, setFormValues] = useState({})
    const strongholdIdRef = useRef('')
    const [strongholdId, setStrongholdId] = useState('');
    const [operationType, setOperationType] = useState('');

    const menu = (
        <Menu
            items={[
                {
                    key: '1',
                    label: (
                        <span onClick={logout}>退出</span>
                    ),
                },
            ]}
        />
    );

    useEffect(() => {
        if (operationType === 'delete') {
            deleteStronghold(strongholdId)
        }
    }, [strongholdId, operationType])


    const [addStronghold] = useMutation(CREATE_STRONGHOLD_MUTATION, {
        update(proxy, result) {
            const { createStronghold } = result.data
            const { getStrongholds } = proxy.readQuery({ query: FETCH_STRONGHOLDS_QUERY });
            proxy.writeQuery({
                query: FETCH_STRONGHOLDS_QUERY, data: { getStrongholds: getStrongholds.concat(createStronghold) }
            });
        }, variables: { strongholdInput: formValues },
    });

    const [deleteStronghold] = useMutation(DELETE_STRONGHOLD_MUTATION, {
        update(proxy, { data: { deleteStronghold } }) {
            message.success(deleteStronghold);
            const { getStrongholds } = proxy.readQuery({ query: FETCH_STRONGHOLDS_QUERY });

            proxy.writeQuery({
                query: FETCH_STRONGHOLDS_QUERY,
                data: { getStrongholds: getStrongholds.filter(item => item.id !== strongholdId) }
            });

        }, variables: { strongholdId }
    });

    const [editStronghold] = useMutation(EDIT_STRONGHOLD_MUTATION, {
        update(proxy, { data: { editStronghold } }) {
            const { getStrongholds } = proxy.readQuery({ query: FETCH_STRONGHOLDS_QUERY });
            //以下可以不用写，apolloCache可以根据id自动更新；
            let newGetStrongholds = getStrongholds.map((item, index) => {
                return item.id === editStronghold.id ? editStronghold : item
            })
            proxy.writeQuery({
                query: FETCH_STRONGHOLDS_QUERY,
                data: { getStrongholds: newGetStrongholds }
            });


        }, variables: { strongholdId, strongholdInput: formValues }
    })

    const jump = (item) => {
        location.href = '/#/item?id=' + item.id + '&name=' + escape(item.name)
    }


    //删除当前局点
    const deleteStrongholdConfirm = (item, e) => {
        e.stopPropagation();
        e.preventDefault();
        const { id } = item
        setStrongholdId(id);
        setOperationType('delete')
        /*        strongholdIdRef.current = id
                setStrongholdId(strongholdIdRef.current)*/
        // deleteStronghold(strongholdId);

    };

    const cancel = (e) => {
        e.stopPropagation();
        e.preventDefault();
    };


    const showModal = () => {
        setVisible(true);
    };


    const handleOk = () => {

        form.validateFields().then(values => {
            setFormValues(values);
            if (operationType === 'edit') {
                editStronghold()
            } else if (operationType === 'add') {
                addStronghold();
            }
            setVisible(false);
            form.resetFields();
        })
            .catch(info => {      //检验失败时；
                console.log('校验失败:', info);
            });
    };

    const handleCancel = () => {
        setVisible(false);
    };


    return (<div className={styles.login}>
        <div className={'logout'}>
            <Space direction="vertical">
                <Space wrap>
                    <Dropdown overlay={menu} placement="bottom">
                        <Button type="link" ghost >
                            {user?.username||""}
                        </Button>
                    </Dropdown>
                </Space>
            </Space>

        </div>
        <div className='nav'>
            局点项目导航页
        </div>
        {loading ? <LoadingData/> : (data.getStrongholds && data.getStrongholds.map((item, index) => <div
            className='item'
            onClick={() => {
                jump(item)
            }}
            key={index}
            onMouseLeave={() => {
            }}
            onMouseEnter={() => {
            }}

        >

            <div className={'edit'} onClick={(e) => {
                setStrongholdId(item?.id);
                setOperationType('edit')
                form.setFieldsValue(item)
                showModal();
                e.stopPropagation();
                e.preventDefault();

            }}>
                <EditOutlined/>
            </div>

            <Popconfirm
                title={`确定要删${item.name}以及里面的子目录吗?`}
                onConfirm={(e) => deleteStrongholdConfirm(item, e)}
                onCancel={cancel}
                okText="是"
                cancelText="否"
            >
                <div className={'close'} onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                }}>
                    <CloseCircleOutlined/>
                </div>
            </Popconfirm>
            {item.name}
        </div>))}
        <div className='add' onClick={() => {
            setOperationType('add');
            form.resetFields();
            showModal();
        }
        }/>
        <Modal
            title={operationType === 'edit' && '修改局点' || operationType === "add" && "添加局点"}
            visible={visible}
            onOk={handleOk}
            onCancel={handleCancel}
            okText="确认"
            cancelText="取消"
        >
            <Form
                form={form}
                name="basic"
                autoComplete="off"
            >
                <Form.Item
                    label="局点名称"
                    name="name"
                    rules={[{ required: true, message: '请输入局点名' }]}
                >
                    <Input/>
                </Form.Item>

                <Form.Item
                    label="局点code"
                    name="code"
                    rules={[{ required: true, message: '请输入局点code' }]}
                >
                    <Input/>
                </Form.Item>
            </Form>
        </Modal>
    </div>)

}

export default Home;