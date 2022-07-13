/**
 * @file Login page
 */

import React from 'react'
import { useNavigate } from 'react-router-dom'
import { SwitchTransition, CSSTransition } from 'react-transition-group'
import { useReactive } from 'veact'
import { notification, Spin, Form, Input, Button, Checkbox } from 'antd'
import * as Icon from '@ant-design/icons'
import tokenService from '@/services/token'
import { useLoading } from 'veact-use'
import { authLogin } from '@/store/auth'
import { RouteKey, rc } from '@/routes'

import styles from './style.module.less'

export const HelloPage: React.FC = () => {
  const navigate = useNavigate()
  const loading = useLoading(false)
  const inputState = useReactive({
    email: '',
    password: '',
    isEdit: false,
  })
  const quitEdit = () => {
    inputState.isEdit = false
  }
  const login = (email: string, password: string) => {
    loading
      .promise(authLogin(email, password))
      .then((newAuth) => {
        tokenService.setToken(newAuth.token.access_token, newAuth.token.expires_in)
        navigate(rc(RouteKey.Dashboard).path)
      })
      .catch((error) => {
        console.warn('Login system failed!', error)
        return Promise.reject(error)
      })
  }

  const handleInputChangeEmail = (event: React.FormEvent<HTMLInputElement>) => {
    inputState.email = (event.target as any).value
  }
  const handleInputChangePassword = (event: React.FormEvent<HTMLInputElement>) => {
    inputState.password = (event.target as any).value
  }
  const handleInputKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (event) => {
    if (event.key === 'Escape') {
      quitEdit()
    }
    if (event.key === 'Enter') {
      if (inputState.email && inputState.password) {
        login(inputState.email, inputState.password)
      }
    }
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (inputState.email && inputState.password) {
      login(inputState.email, inputState.password)
    }
    if (!inputState.email) {
      notification.info({
        message: 'Please enter your email address',
      })
    }
    if (!inputState.password) {
      notification.info({
        message: 'Please enter your password',
      })
    }
  }

  return (
    <div className={styles.helloPage}>
      <Spin spinning={loading.state.value} indicator={<Icon.LoadingOutlined />}>
        <h1>Email</h1>

        <input
          type="email"
          id="email"
          className={styles.input}
          autoComplete="true"
          autoFocus={true}
          disabled={loading.state.value}
          value={inputState.email}
          onInput={handleInputChangeEmail}
          onBlur={quitEdit}
          onKeyDownCapture={handleInputKeyDown}
        />
        <h1>Password</h1>
        <input
          type="password"
          id="password"
          className={styles.input}
          autoComplete="true"
          autoFocus={true}
          disabled={loading.state.value}
          value={inputState.password}
          onInput={handleInputChangePassword}
          onBlur={quitEdit}
          onKeyDownCapture={handleInputKeyDown}
        />
      </Spin>
    </div>
  )
}
