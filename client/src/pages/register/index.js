import React, { useContext, useState } from 'react';
import {
    message,
    AutoComplete,
    Button,
    Cascader,
    Checkbox,
    Col,
    Form,
    Input,
    InputNumber,
    Row,
    Select,
} from 'antd';
// import { Form, Input, Button } from "semantic-ui-react";
import {
    ApolloClient,
    InMemoryCache,
    ApolloProvider,
    useMutation,
    gql
} from "@apollo/client";

import { useForm } from "../../utils/hook";
import { AuthContext } from "../../context/auth";
import styles from './index.less';



//查询语句
const REGISTER_USER = gql`mutation register(
    $username:String!,
    $email:String!,
    $password:String!,
    $confirmPassword:String!,
){
    register(registerInput: {username:$username,email:$email,password: $password,confirmPassword: $confirmPassword }){
        token,
        username,
    }
}`


const Index = (props) => {
    const context = useContext(AuthContext);
    const [form] = Form.useForm();
    const [errors, setErrors] = useState({});
    /*
        const [values, setValues] = useState({
            username: "",
            email: "",
            password: "",
            confirmPassword: ""
        });
    */

    const onFinish = (values) => {
        onChange(values);
        onSubmit();

    };

    const registerUser = () => {
        addUser();
    }

    const { onChange, onSubmit, values } = useForm(registerUser, {
        username: "",
        email: "",
        password: "",
        confirmPassword: ""
    })


    const [addUser, { data, loading, error }] = useMutation(REGISTER_USER, {
        update(_, { data: { register: userData } }) {
            // console.dir(result);
            context.login(userData)
            props.history.push("/");
        },
        onError(err) {
            setErrors(err.message.toString())
            message.error(err.message.toString())
        },
        variables: values
    })


    const formItemLayout = {
        labelCol: {
            xs: {
                span:3,
            },
            sm: {
                span:5,
                // offset:-12,
            },
        },
        wrapperCol: {
            xs: {
                span: 24,
            },
            sm: {
                span: 16,
            },
        },
    };

    const tailFormItemLayout = {
        wrapperCol: {
            xs: {
                span:16,
                offset: 5,
            },
            sm: {
                span:16,
                offset: 5,
            },
        },
    };

    return (
        <div className={styles.content}>
            <h1 className={styles.title}>用户注册</h1>
            <Form
                className={styles.registerForm}
                autoComplete="off"
                {...formItemLayout}
                form={form}
                name="register"
                onFinish={onFinish}
                initialValues={{
                    residence: ['zhejiang', 'hangzhou', 'xihu'],
                    prefix: '86',
                }}
                scrollToFirstError
            >
                <Form.Item
                    name="username"
                    label="用户名"
                    tooltip="来取个好记住的用户名吧"
                    rules={[
                        {
                            required: true,
                            message: '请输入用户名',
                            whitespace: true,
                        },
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="email"
                    label="邮箱"
                    rules={[
                        {
                            type: 'email',
                            message: '邮箱格式错误',
                        },
                        {
                            required: true,
                            message: '请输入您的邮箱',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="password"
                    label="密码"
                    rules={[
                        {
                            required: true,
                            message: '请输入你的密码',
                        },
                    ]}
                    hasFeedback
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item
                    name="confirmPassword"
                    label="确认密码"
                    dependencies={['password']}
                    hasFeedback
                    rules={[
                        {
                            required: true,
                            message: '请再次输入你的密码',
                        },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('password') === value) {
                                    return Promise.resolve();
                                }

                                return Promise.reject(new Error('两次密码输入不匹配'));
                            },
                        }),
                    ]}
                >
                    <Input.Password />
                </Form.Item>
                <Form.Item {...tailFormItemLayout}>
                    <Button type="primary" htmlType="submit" className={styles.registerFormButton}>
                        注册
                    </Button>
                </Form.Item>
            </Form>




            {/*<Form onSubmit={onSubmit} noValidate className={loading ? 'loading' : ''}>
                <h1>注册</h1>

                <Form.Field
                    name={'username'}
                    control={Input}
                    label='用户名'
                    placeholder='用户名'
                    value={values.username}
                    onChange={onChange}


                />
                <Form.Field
                    control={Input}
                    label='邮箱'
                    placeholder='邮箱'
                    name={'email'}
                    value={values.email}
                    onChange={onChange}

                />
                <Form.Field
                    control={Input}
                    label='密码'
                    placeholder='密码'
                    name={'password'}
                    value={values.password}
                    onChange={onChange}

                />
                <Form.Field
                    control={Input}
                    label='确认密码'
                    placeholder='确认密码'
                    name={'confirmPassword'}
                    value={values.confirmPassword}
                    onChange={onChange}

                />
                <Form.Field control={Button} primary>Submit</Form.Field>
            </Form>*/}


        </div>
    );
}
export default Index;