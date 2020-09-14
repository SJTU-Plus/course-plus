import React from 'react'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'

export default function ({ show, nextStep }) {
  return (
    <Modal show={show}>
      <Modal.Header closeButton onHide={() => nextStep(false)}>
        <Modal.Title>jAccount 授权</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Course+ 需要从您的 jAccount 读取课程信息。</p>
        <p className='text-muted'>
          Course+ 的服务器不会存储您的课程信息。当您使用新设备打开 Course+
          时，您需要重新从教学信息服务网同步数据。
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant='outline-secondary' onClick={() => nextStep(false)}>
          关闭
        </Button>
        <Button variant='outline-primary' onClick={() => nextStep(true)}>
          继续
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
