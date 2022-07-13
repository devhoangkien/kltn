import React from 'react'
import { useLoadings } from 'veact-use'
import { Button, Row, Col, Divider, Modal } from 'antd'
import * as Icon from '@ant-design/icons'
import { updateDatabaseBackup, updateArchiveCache } from '@/store/system'

export interface DataFormProps {
  labelSpan: number
  wrapperSpan: number
}

enum LoadingKey {
  Databse = 'databse',
  Archive = 'archive',
}

export const DataForm: React.FC<DataFormProps> = (props) => {
  const loading = useLoadings(LoadingKey.Databse, LoadingKey.Archive)

  const handleUpdateDatabaseBackup = () => {
    Modal.confirm({
      centered: true,
      title: 'Updating the backup will force an overwrite of the old database backup, are you sure you want to continue?',
      onOk: () => loading.promise(LoadingKey.Databse, updateDatabaseBackup()),
    })
  }

  const handleUpdateArchive = () => {
    Modal.confirm({
      centered: true,
      title: 'All full data caches of the entire site will be updated. Are you sure you want to continue?',
      onOk: () => loading.promise(LoadingKey.Archive, updateArchiveCache()),
    })
  }

  return (
    <Row>
      <Col span={props.wrapperSpan} offset={props.labelSpan}>
        <Button.Group>
          <Button
            icon={<Icon.CloudUploadOutlined />}
            type="primary"
            loading={loading.isLoading(LoadingKey.Databse)}
            onClick={handleUpdateDatabaseBackup}
          >
            Update database backup now
          </Button>
          <Button icon={<Icon.CloudDownloadOutlined />} type="primary" disabled={true}>
            Restore database from backup file (not supported yet)
          </Button>
        </Button.Group>
        <Divider />
        <Button
          icon={<Icon.SyncOutlined />}
          type="primary"
          loading={loading.isLoading(LoadingKey.Archive)}
          onClick={handleUpdateArchive}
        >
          Renew Archive
        </Button>
      </Col>
    </Row>
  )
}
