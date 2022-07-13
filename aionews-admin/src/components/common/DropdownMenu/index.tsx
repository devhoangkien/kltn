/**
 * @desc General DropdownMenu
 */

import React from 'react'
import { Button, Dropdown, Menu } from 'antd'
import * as Icon from '@ant-design/icons'

export interface ButtonMenuProps {
  className?: string
  disabled?: boolean
  onClick?(): any
  options: Array<{
    icon?: React.ReactNode
    label: React.ReactNode
    onClick(): any
  }>
}

export const DropdownMenu: React.FC<ButtonMenuProps> = (props) => {
  return (
    <Dropdown
      className={props.className}
      disabled={props.disabled}
      overlay={
        <Menu onClick={props.onClick}>
          {props.options.map((option, index) => (
            <Menu.Item key={index} icon={option.icon} onClick={option.onClick}>
              {option.label}
            </Menu.Item>
          ))}
        </Menu>
      }
    >
      <Button disabled={props.disabled}>
        {props.children} <Icon.DownOutlined />
      </Button>
    </Dropdown>
  )
}
