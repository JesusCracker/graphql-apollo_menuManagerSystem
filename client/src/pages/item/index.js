import React, { useState, useEffect } from 'react';
import {
    ApolloClient,
    InMemoryCache,
    ApolloProvider,
    useQuery,
    gql, useMutation
} from "@apollo/client";
import { ArrowLeftOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { Tabs, Tag, Button, Space, Table, Modal, Form, Input, Row, Col, Popconfirm, message } from 'antd';
import LoadingData from "../../components/loading";
import styles from './index.less';
const { TabPane } = Tabs;

const FETCH_STRONGHOLD_QUERY = gql`
    query getStronghold($strongholdId: ID!) {
        getStronghold(strongholdId: $strongholdId) {
            id,
            code,
            username,
            name,
            mg{
                id,
                name,
                address,
                web,
                server,
                user,
                test,
                pm,
                username,
            },
            epg{
                id,
                name,
                address,
                web,
                server,
                user,
                test,
                pm,
                username,
            }
        }
    }
`;

const CREATE_POSITION_MUTATION = gql`
    mutation($strongholdId: ID!, $positionInput: PositionInput){
        createPosition(strongholdId: $strongholdId,positionInput: $positionInput) {
            username,
            name,
            id,
            mg{
                id,
                name,address,web,
                server,user,test,
                pm,username,
            }
            epg{
                id,
                name,address,web,
                server,user,test,
                pm,username,
            }
        }
    }
`;

const EDIT_POSITION_MUTATION = gql`mutation($strongholdId: ID!, $positionId: ID!, $positionInput: PositionInput){
    editPosition(strongholdId: $strongholdId, positionId: $positionId,positionInput: $positionInput) {
        name,
        username,
        id,
        mg {
            name,
            address,
            web,
            server,
            user,
            username,
            test,
            pm,
        }
        epg {
            name,
            address,
            web,
            server,
            user,
            username,
            test,
            pm,
        }
    }
}`


const DELETE_POSITION_MUTATION = gql`
    mutation deletePosition($strongholdId: ID!,$positionId:ID!,$type:String!) {
        deletePosition(strongholdId: $strongholdId,positionId:$positionId,type: $type)
    }
`;


const Content = (props) => {
    const [form] = Form.useForm();
    const [visible, setVisible] = useState(false);
    const [tabType, setTabType] = useState('EPG')
    const [editOrAdd, setEditOrAdd] = useState('edit');
    const [operationType, setOperationType] = useState('');
    const [formValues, setFormValues] = useState([])
    const [positionId, setPositionId] = useState('');

    useEffect(() => {
        if (operationType === 'delete') {
            deletePosition()
        } else if (operationType === 'edit' && formValues.length > 0) {
            editPosition()
        }
    }, [positionId, operationType])


    const { location: { search } } = props;
    const params = new URLSearchParams(search);
    let id = params.get('id');
    let name = params.get('name')


    const { data, loading } = useQuery(FETCH_STRONGHOLD_QUERY, {
        variables: { strongholdId: id }
    });


    const [addPosition] = useMutation(CREATE_POSITION_MUTATION, {
        update(proxy, result) {
            const { createPosition } = result.data
            const { getStronghold } = proxy.readQuery({
                query: FETCH_STRONGHOLD_QUERY, variables: {
                    strongholdId: id,
                }
            })
            proxy.writeQuery({
                query: FETCH_STRONGHOLD_QUERY, variables: {
                    strongholdId: id,
                },
                data: {
                    getStronghold: tabType === "EPG" ? getStronghold.epg.concat(createPosition.epg) : getStronghold.mg.concat(createPosition.mg)
                }
            });
        }, variables: { strongholdId: id, positionInput: { ...formValues, type: tabType } },
    });


    const [editPosition] = useMutation(EDIT_POSITION_MUTATION, {
        update(proxy, result) {
            const { editPosition } = result.data
            proxy.writeQuery({
                query: FETCH_STRONGHOLD_QUERY, variables: {
                    strongholdId: id,
                },
                data: {
                    getStronghold: tabType === "EPG" ? editPosition.epg : editPosition.mg
                }
            });

        }, variables: { strongholdId: id, positionId, positionInput: { ...formValues, type: tabType } },
    });


    const [deletePosition] = useMutation(DELETE_POSITION_MUTATION, {
        update(proxy, { data: { deletePosition } }) {
            message.success(deletePosition);
            const { getStronghold } = proxy.readQuery({
                query: FETCH_STRONGHOLD_QUERY, variables: {
                    strongholdId: id,
                }
            })

            proxy.writeQuery({
                query: FETCH_STRONGHOLD_QUERY, variables: {
                    strongholdId: id,
                },
                data: {
                    getStronghold: tabType === "EPG" ? getStronghold.epg.filter(item => item.id !== positionId) : getStronghold.mg.filter(item => item.id !== positionId)
                }
            });

        }, variables: { strongholdId: id, positionId, type: tabType }
    });


    if (loading) {
        return <LoadingData/>
    } else {
        const { getStronghold } = data;
        const {
            id,
            code,
            username,
            name,
            mg,
            epg
        } = getStronghold;

        const handleDelete = (record, operationType) => {
            const { id: positionId, name } = record;
            setOperationType(operationType);
            setPositionId(positionId)


        }

        const handleEdit = (record, operationType) => {
            const { id: positionId, name } = record;
            setPositionId(positionId)
            form.resetFields();
            form.setFieldsValue(record)
            setVisible(true);
            setOperationType(operationType);
            setEditOrAdd('edit');
        }


        const handleTabChange = (key) => {
            form.resetFields();
            setTabType(key);

        };


        const add = () => {
            form.resetFields();
            setVisible(true);
            setEditOrAdd('add');
        }

        const handleCancel = () => {
            setVisible(false);
        };

        const handleOk = () => {
            form.validateFields().then(values => {
                setFormValues(values)
                if (values?.id) {
                    delete values.id;
                    setFormValues({ ...values });
                    editPosition()
                } else {
                    addPosition()
                }
                setVisible(false);
                form.resetFields();

            }).catch(info => {
                //检验失败时；
                console.log('校验失败:', info);
            });
        };

        const columns = [
            {
                title: '项目名称',
                dataIndex: 'name',
                key: 'name',
            },

            {
                title: '项目地址（点击跳转）',
                dataIndex: 'address',
                key: 'address',
                width: 650,
                ellipsis: true,
                render: (text) => <a href={text} target='_blank'>{text}</a>
            },
            {
                title: '项目创建者',
                dataIndex: 'user',
                key: 'user',
            }, {
                title: '前端',
                key: 'web',
                dataIndex: 'web',
            },
            {
                title: '后端',
                key: 'server',
                dataIndex: 'server',
            },
            {
                title: '项目经理',
                key: 'pm',
                dataIndex: 'pm',
            },
            {
                title: '测试人员',
                key: 'test',
                dataIndex: 'test',
            },
            {
                title: '操作',
                key: 'action',
                render: (_, record) =>
                    epg.length >= 1 || cms.length >= 1 ? (
                        <div className={'operateTools'}>
                            <span className={'operateTools-delete'}>
                                         <Popconfirm
                                             title={`确定删除项目名为${record.name}吗？`}
                                             okText="是"
                                             cancelText="否"
                                             onConfirm={() => handleDelete(record, 'delete')}>
                                <a>删除</a>
                            </Popconfirm>
                            </span>
                            <span className={'operateTools-edit'}>
                                  <a onClick={() => handleEdit(record, 'edit')}>编辑</a>
                            </span>
                        </div>

                    ) : null,
            },
        ];

        return <div className={styles.login}>

            <div className="back" onClick={() => {
                location.replace('/#/')
            }}>
                <ArrowLeftOutlined/>
            </div>
            <div className={'title'}>{name}</div>

            <Tabs defaultActiveKey="EPG" className={'pannel'} onChange={handleTabChange}>
                <TabPane tab="EPG" key="EPG" style={{ padding: '10px'}}>
                    <Button type={'primary'} style={{ marginBottom: '10px' }} onClick={() => add()}>新增</Button>
                    {

                        <Table columns={columns} scroll={{
                            y: 'calc(100vh - 230px)',
                        }} bordered pagination={false} dataSource={epg}/>
                    }

                </TabPane>
                <TabPane tab="管理端" key="CMS" style={{ padding: '10px' }}>
                    <Button type={'primary'} style={{ marginBottom: '10px' }} onClick={() => add()}>新增</Button>
                    <Table columns={columns}
                           scroll={{
                               y: 'calc(100vh - 230px)',
                           }}
                           bordered
                           pagination={false}
                           dataSource={mg}/>
                </TabPane>
            </Tabs>

            <Modal
                width={800}
                title={editOrAdd === 'add' ? `添加${tabType==="EPG"?"EPG":"管理端"}子局点` : `修改${tabType==="EPG"?"EPG":"管理端"}子局点`}
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
                    <Row>
                        <Col xs={10} sm={10} md={10} lg={10} xl={10} offset={1}>
                            <Form.Item
                                name="id"
                                style={{ display: "none" }}
                            >
                                <Input/>
                            </Form.Item>
                            <Form.Item
                                label="项目名称"
                                name="name"
                                rules={[{ required: true, message: '请输入项目名称' }]}
                            >
                                <Input/>
                            </Form.Item>
                        </Col>

                        <Col xs={10} sm={10} md={10} lg={10} xl={10} offset={3}>
                            <Form.Item
                                label="创建者"
                                name="user"
                                rules={[{ required: true, message: '请输入项目创建者名字' }]}
                            >
                                <Input/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={10} sm={10} md={10} lg={10} xl={10} offset={1}>
                            <Form.Item
                                label="前端开发"
                                name="web"
                                rules={[{ required: true, message: '请输入前端开发人员姓名' }]}
                            >
                                <Input/>
                            </Form.Item>
                        </Col>

                        <Col xs={10} sm={10} md={10} lg={10} xl={10} offset={3}>
                            <Form.Item
                                label="后端开发"
                                name="server"
                                rules={[{ required: true, message: '请输入后端开发人员姓名' }]}
                            >
                                <Input/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={10} sm={10} md={10} lg={10} xl={10} offset={1}>
                            <Form.Item
                                label="产品经理"
                                name="pm"
                                rules={[{ required: true, message: '请输入产品经理姓名' }]}
                            >
                                <Input/>
                            </Form.Item>
                        </Col>

                        <Col xs={10} sm={10} md={10} lg={10} xl={10} offset={3}>
                            <Form.Item
                                label="测试人员"
                                name="test"
                                rules={[{ required: true, message: '请输入测试人员姓名' }]}
                            >
                                <Input/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                            <Form.Item
                                label="项目跳转地址"
                                name="address"
                                rules={[{ required: true, message: '请输入项目跳转地址' }]}
                            >
                                <Input/>
                            </Form.Item>
                        </Col>
                    </Row>


                </Form>
            </Modal>


        </div>
    }
}

export default Content