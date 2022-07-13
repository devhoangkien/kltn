/**
 * @desc App auth interceptor component
 */

import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useRef, onMounted, onBeforeUnmount } from 'veact'
import { useLoading } from 'veact-use'
import { notification, Typography } from 'antd'
import { SwitchTransition, CSSTransition } from 'react-transition-group'

import { RouteKey, rc } from '@/routes'
import { renewalToken, checkTokenValidity } from '@/store/auth'
import { getTokenCountdown, setToken, removeToken, isTokenValid } from '@/services/token'

import styles from './style.module.less'

let renewalTimer: null | number = null

export const AppAuth: React.FC = (props) => {
  const navigate = useNavigate()
  const loading = useLoading()
  const isLogined = useRef(false)

  // Stop token renewal
  const stopRenewalToken = (): void => {
    if (typeof renewalTimer === 'number') {
      window.clearTimeout(renewalTimer)
    }
  }

  // auto-renew Token
  const runRenewalToken = (): void => {
    stopRenewalToken()
    const countdown = getTokenCountdown()
    const seconds = countdown - 10
    console.info(`Token auto-renewal is working, token will auto-renew after ${seconds}s!`)
    renewalTimer = window.setTimeout(() => {
      renewalToken().then((auth) => {
        setToken(auth.access_token, auth.expires_in)
        runRenewalToken()
      })
    }, seconds * 1000)
  }

  onMounted(async () => {
    try {
      // Check local when program initializes Token
      console.info('Token Checking...')
      // Token local check
      await (isTokenValid() ? Promise.resolve() : Promise.reject('Local Token is invalid'))
      // Token remote verification
      await loading.promise(checkTokenValidity())
      // After verification, initialize the APP
      console.info('TokenValidation succeeded, working normally')
      // Start auto-renewal Token
      runRenewalToken()
      // need a delay effect
      setTimeout(() => {
        isLogined.value = true
      }, 668)
    } catch (error) {
      console.warn('Token is verified to be invalid, jump to the landing page:', error)
      notification.info({
        message: `haven't seen you for a long time!`,
        description: 'How are you?',
      })
      removeToken()
      navigate(rc(RouteKey.Hello).path)
    }
  })

  onBeforeUnmount(() => {
    stopRenewalToken()
  })

  return (
    <SwitchTransition mode="out-in">
      <CSSTransition
        classNames="fade"
        key={Number(isLogined.value)}
        addEndListener={(node, done) => {
          node.addEventListener('transitionend', done, false)
        }}
      >
        {isLogined.value ? (
          <div className={styles.authContainer}>{props.children}</div>
        ) : (
          <div className={styles.loading}>
            <div className={styles.animation}>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
            <Typography.Text className={styles.text} disabled>
              {loading.state.value ? 'check Token...' : 'initialization...'}
            </Typography.Text>
          </div>
        )}
      </CSSTransition>
    </SwitchTransition>
  )
}
