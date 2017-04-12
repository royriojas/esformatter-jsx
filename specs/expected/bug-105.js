// Actual result
import { Row, Col } from 'react-bootstrap';

const Status = props => (
  <Row>
    <Col md={ 5 }>
      <strong>Status</strong>
      <a>
        <p>
          <div> <strong>{ props.test }</strong> </div>
        </p>
      </a>
    </Col>
    <Col md={ 2 }>
      <strong>Door</strong>
    </Col>
    <Col md={ 5 }>
      <strong>Om</strong>
    </Col>
  </Row>
);