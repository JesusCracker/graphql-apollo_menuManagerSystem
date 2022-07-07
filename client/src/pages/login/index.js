import React, { useState, useContext, useEffect } from 'react';
// import { Button, Form, Input } from "semantic-ui-react";
import { Button, Checkbox, Form, Input } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import {
    ApolloClient,
    InMemoryCache,
    ApolloProvider,
    useMutation,
    gql
} from "@apollo/client";
import * as encryptions from '../../utils/basicTools';
import { useForm } from "../../utils/hook";
import { AuthContext } from "../../context/auth";
import { Link } from "react-router-dom";
import styles from './index.less';


const USER_LOGIN = gql`mutation login($username:String!,$password:String!)
{
    login(loginInput:{username: $username,password: $password} ){
        token,
        username
    }
}`


const Index = (props) => {
    const [form] = Form.useForm();
    const [autoLogin,setAutoLogin]=useState(false)
    const [loginUserInfo,setLoginUserInfo]=useState({});
    const context = useContext(AuthContext);
    const [errors, setErrors] = useState({});


    useEffect(()=>{
        if (typeof localStorage !== 'undefined') {
            if (localStorage.getItem('autoLogin')) {
                setAutoLogin(JSON.parse(localStorage.getItem('autoLogin')))
            }
            if (localStorage.getItem('loginUserInfo')) {
                const loginUserInfo = JSON.parse(encryptions.decodeBase64(localStorage.getItem('loginUserInfo')));
                setLoginUserInfo(loginUserInfo)
                form.setFieldsValue(loginUserInfo)
            }
        }
    },[autoLogin])


    const loginUser = () => {
        userLogin();
    }

    const { onChange, onSubmit, values } = useForm(loginUser, {
        username: "",
        password: "",
    })

    const onFinish = (values) => {
        if (autoLogin) {
            const str = JSON.stringify(values);
            const encodeStr = encryptions.encodeBase64(str);
            localStorage.setItem('loginUserInfo', encodeStr);
        } else {
            localStorage.removeItem('loginUserInfo');
        }
        onChange(values);
        onSubmit();
    };


    const [userLogin, { data, loading, error }] = useMutation(USER_LOGIN, {
        //result是成功后返回的值
        update(_, { data: { login: userData } }) {
            context.login(userData)
            props.history.push("/");
        },
        onError(err) {
            // console.dir(err);
            setErrors(err.message.toString())
        },
        variables: values
    })

   const changeAutoLogin = e => {
        setAutoLogin(e.target.checked);
        localStorage.setItem('autoLogin', e.target.checked);
    };


    return (
        <div className={styles.content}>

            <div className={styles.login}>
                <div className={styles.title}>内部局点菜单管理系统</div>
                <Form
                    form={form}
                    autoComplete="off"
                    name="normal_login"
                    className={styles.loginForm}
                    // initialValues={{
                    //     remember: true,
                    // }}
                    onFinish={onFinish}
                >
                    <Form.Item
                        name="username"
                        rules={[
                            {
                                required: true,
                                message: '请输入用户名',
                            },
                        ]}
                    >
                        <Input  prefix={<UserOutlined className="site-form-item-icon" />} placeholder="用户名"/>
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: '请输入密码',
                            },
                        ]}
                    >
                        <Input
                            prefix={<LockOutlined className="site-form-item-icon" />}
                            type="password"
                            placeholder="密码"
                        />
                    </Form.Item>
                    <Form.Item>
                        <Form.Item valuePropName="checked" noStyle >
                            <Checkbox checked={autoLogin}  onChange={changeAutoLogin}>记住密码</Checkbox>
                        </Form.Item>

                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" className={styles.loginFormButton}>
                            登陆
                        </Button>
                        Or
                        <Link to={{
                            pathname: '/register',
                            state: {  // 页面跳转要传递的数据，如下
                                data1: {},
                            data2: []
                        }, }}
                    >
                        <span>
                            注册
                        </span>
                    </Link>
                    </Form.Item>
                </Form>
            </div>

            {errors && errors.length > 0 && (
                <div className={"ui error message"}>
                    {errors}
                </div>
            )}
        </div>
    );
}

export default Index;