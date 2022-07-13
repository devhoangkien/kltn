import React from 'react'
import { useRef, onMounted } from 'veact'
import { useLoading } from 'veact-use'
import { Row, Col, Card, Statistic, Space, Divider } from 'antd'
import * as Icon from '@ant-design/icons'
import { APP_LAYOUT_GUTTER_SIZE } from '@/config'
import { Statistics, getStatistics } from '@/store/system'

import styles from './style.module.less'

export const StatisticsComponent: React.FC = () => {
  const statistics = useRef<Statistics>({})
  const loading = useLoading()

  const fetchStatistics = () => {
    loading.promise(getStatistics()).then((result) => {
      statistics.value = result
    })
  }

  onMounted(() => {
    fetchStatistics()
  })

  return (
    <Row gutter={APP_LAYOUT_GUTTER_SIZE} className={styles.statistic}>
      <Col span={8}>
        <Card bordered={false} className={styles.statisticCard}>
          <Row>
            <Col span={18}>
              <Space size="middle">
                <Statistic
                  loading={loading.state.value}
                  title="Views today"
                  value={statistics.value.todayViews}
                />
                <Divider type="vertical" />
                <Statistic
                  loading={loading.state.value}
                  title="Total views"
                  value={statistics.value.totalViews}
                />
              </Space>
            </Col>
            <Col span={6} className={styles.icon}>
              <Icon.EyeOutlined />
            </Col>
          </Row>
        </Card>
      </Col>
      <Col span={8}>
        <Card bordered={false} className={styles.statisticCard}>
          <Row>
            <Col span={18}>
              <Space size="middle">
                <Statistic
                  loading={loading.state.value}
                  title="Total likes"
                  value={statistics.value.totalLikes}
                />
                <Divider type="vertical" />
                <Statistic
                  loading={loading.state.value}
                  title="Feedback"
                  value={statistics.value.averageEmotion || '-'}
                />
              </Space>
            </Col>
            <Col span={6} className={styles.icon}>
              <Icon.HeartOutlined />
            </Col>
          </Row>
        </Card>
      </Col>
      <Col span={8}>
        <Card bordered={false} className={styles.statisticCard}>
          <Row>
            <Col span={18}>
              <Space size="middle">
                <Statistic
                  loading={loading.state.value}
                  title="Comments"
                  value={statistics.value.comments}
                />
                <Divider type="vertical" />
                <Statistic
                  loading={loading.state.value}
                  title="Articles"
                  value={statistics.value.articles}
                />
                <Divider type="vertical" />
                <Statistic
                  loading={loading.state.value}
                  title="Tags"
                  value={statistics.value.tags}
                />
              </Space>
            </Col>
            <Col span={6} className={styles.icon}>
              <Icon.CoffeeOutlined />
            </Col>
          </Row>
        </Card>
      </Col>
    </Row>
  )
}
