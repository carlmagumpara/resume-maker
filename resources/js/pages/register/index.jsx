import { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Card, Alert, Modal } from 'react-bootstrap';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useRegisterMutation, useSendOTPCodeMutation, useVerifyOTPCodeMutation } from 'src/redux/services/register'; 
import { storeUser } from 'src/redux/reducers/user';
import { storeToken } from 'src/redux/reducers/token';
import { updateState } from 'src/redux/updateState';
import { Formik } from 'formik';
import * as Yup from 'yup';
import logo from 'src/assets/logo-full.png';
import Password from 'src/pages/login/Password';
import moment from 'moment';
import { useAntMessage } from 'src/context/ant-message';
import { barangays } from 'src/constants/barangays';

function Index() {
  const antMessage = useAntMessage();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [register] = useRegisterMutation();
  const [verifyOTPCode] = useVerifyOTPCodeMutation();
  const [sendOTPCode] = useSendOTPCodeMutation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [terms, setTerms] = useState(false);
  const [data, setData] = useState({});
  const [token, setToken] = useState({});
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);

  const handleShow = () => setShow(true);

  const submitRegister = async (values, callback, setErrors) => {
    try {
      const response = await register(values).unwrap();
      if (response.success) {
        setData({ ...values, account: searchParams.get('account') });
        setToken(response.token);
        handleShow();
      } else {
        antMessage.error(response.message);
      }
      callback();
    } catch(error) {
      if (error.status === 422) {
        setErrors(error.data.errors);
      }
      callback();
    }
  };

  const resendOTPCode  = async () => {
    try {
      const response = await sendOTPCode(data).unwrap();
      if (response.success) {
        setToken(response.token);
        antMessage.success(response.message);
      } else {
        antMessage.error(response.message);
      }
    } catch(error) {
      antMessage.error(JSON.stringify(error.data));
    }
  };

  const verifyCode  = async (values, callback, setErrors) => {
    try {
      const response = await verifyOTPCode({ token, ...data, ...values }).unwrap();
      console.log(response);
      if (response.success) {
        await dispatch(updateState(storeUser(response.user)));
        await dispatch(updateState(storeToken(response.token)));
        antMessage.success(response.message);
      } else {
        antMessage.error(response.message);
      }
      callback();
    } catch(error) {
      if (error.status === 422) {
        setErrors(error.data.errors);
      }
      callback();
    }
  };

  return (
    <>
      <Container>
        <Row className="d-flex align-items-center">
          <Col md={{ span: 10, offset: 1 }}>
            <Card className="mb-5 mt-5">
              <Card.Header className="bg-white p-3 border-0" as="h4">
                Create your {searchParams.get('account')} account
              </Card.Header>
              <Card.Body>
                <Formik
                  initialValues={{
                    first_name: '',
                    last_name: '',
                    gender: '',
                    date_of_birth: '',
                    email: '',
                    password: '',
                    password_confirmation: '',
                  }}
                  validationSchema={Yup.object().shape({
                    first_name: Yup.string().required('Required'),
                    last_name: Yup.string().required('Required'),
                    gender: Yup.string().required('Required'),
                    date_of_birth: Yup.string().required('Required'),
                    email: Yup.string().email('Invalid email').required('Required'),
                    password: Yup.string().required('Required'),
                    password_confirmation: Yup.string().required('Required').oneOf([Yup.ref('password'), null], 'Passwords must match')
                  })}
                  onSubmit={(values, { setSubmitting, setErrors }) => {
                    setSubmitting(true);
                    setTimeout(() => {
                      submitRegister(values, () => {
                        setSubmitting(false);
                      }, setErrors);
                    }, 400);
                  }}
                >
                  {({
                    values,
                    errors,
                    touched,
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    isSubmitting,
                 }) => (
                  <Form onSubmit={handleSubmit} autoComplete="new-off">
                    <Row>
                      <Col md={4}>
                        <Form.Group className="mb-3 position-relative">
                          <Form.Label>First Name <span className="text-danger">*</span></Form.Label>
                          <Form.Control 
                            type="text"
                            name="first_name"
                            placeholder="First Name"
                            value={values.first_name}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={errors.first_name && touched.first_name && 'is-invalid'}
                          />
                          {errors.first_name && touched.first_name && <Form.Control.Feedback style={{ fontSize: 12 }} className="end-0" type="invalid" tooltip>{errors.first_name}</Form.Control.Feedback>}
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group className="mb-3 position-relative">
                          <Form.Label>Middle Name</Form.Label>
                          <Form.Control 
                            type="text"
                            name="middle_name"
                            placeholder="Middle Name (Optional)"
                            value={values.middle_name}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={errors.middle_name && touched.middle_name && 'is-invalid'}
                          />
                          {errors.middle_name && touched.middle_name && <Form.Control.Feedback style={{ fontSize: 12 }} className="end-0" type="invalid" tooltip>{errors.middle_name}</Form.Control.Feedback>}
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group className="mb-3 position-relative">
                          <Form.Label>Last Name <span className="text-danger">*</span></Form.Label>
                          <Form.Control 
                            type="text"
                            name="last_name"
                            placeholder="Last Name"
                            value={values.last_name}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={errors.last_name && touched.last_name && 'is-invalid'}
                          />
                          {errors.last_name && touched.last_name && <Form.Control.Feedback style={{ fontSize: 12 }} className="end-0" type="invalid" tooltip>{errors.last_name}</Form.Control.Feedback>}
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3 position-relative">
                          <Form.Label>Gender <span className="text-danger">*</span></Form.Label>
                          <Form.Select
                            name="gender"
                            value={values.gender}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={errors.gender && touched.gender && 'is-invalid'}
                          >
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                          </Form.Select>
                          {errors.gender && touched.gender && <Form.Control.Feedback style={{ fontSize: 12 }} className="end-0" type="invalid" tooltip>{errors.gender}</Form.Control.Feedback>}
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3 position-relative">
                          <Form.Label>Date of Birth <span className="text-danger">*</span></Form.Label>
                          <Form.Control
                            max={moment().format('YYYY-MM-DD')}
                            type="date"
                            name="date_of_birth"
                            placeholder="Date of Birth"
                            value={values.date_of_birth}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={errors.date_of_birth && touched.date_of_birth && 'is-invalid'}
                          />
                          {errors.date_of_birth && touched.date_of_birth && <Form.Control.Feedback style={{ fontSize: 12 }} className="end-0" type="invalid" tooltip>{errors.date_of_birth}</Form.Control.Feedback>}
                        </Form.Group>
                      </Col>
                    </Row>
                    <Form.Group className="mb-3 position-relative">
                      <Form.Label>Email <span className="text-danger">*</span></Form.Label>
                      <Form.Control 
                        type="email" 
                        name="email"
                        placeholder="Email"
                        value={values.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={errors.email && touched.email && 'is-invalid'}
                      />
                      {errors.email && touched.email && <Form.Control.Feedback style={{ fontSize: 12 }} className="end-0" type="invalid" tooltip>{errors.email}</Form.Control.Feedback>}
                    </Form.Group>
                    <Form.Group className="mb-3 position-relative">
                      <Form.Label>Password <span className="text-danger">*</span></Form.Label>
                      <Password
                        type="password" 
                        name="password"
                        placeholder="Password"
                        value={values.password}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={errors.password && touched.password && 'is-invalid'}
                        renderErrors={() => errors.password && touched.password && <Form.Control.Feedback style={{ fontSize: 12 }} className="end-0" type="invalid" tooltip>{errors.password}</Form.Control.Feedback>}
                      />
                    </Form.Group>
                    <Form.Group className="mb-3 position-relative">
                      <Form.Label>Password Confirmation <span className="text-danger">*</span></Form.Label>
                      <Password
                        type="password" 
                        name="password_confirmation"
                        placeholder="Password Confirmation"
                        value={values.password_confirmation}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={errors.password_confirmation && touched.password_confirmation && 'is-invalid'}
                        renderErrors={() => errors.password_confirmation && touched.password_confirmation && <Form.Control.Feedback style={{ fontSize: 12 }} className="end-0" type="invalid" tooltip>{errors.password_confirmation}</Form.Control.Feedback>}
                      />
                    </Form.Group>
                    <div className="text-center">
                      <Form.Check
                        inline
                        label={<p>I have read and agreed to the <a href="#" onClick={() => { event.preventDefault(); navigate('/modal/terms-and-conditions', { state: { previousLocation: location } }) }}>terms and conditions</a></p>}
                        name="group1"
                        type="checkbox"
                        id="terms"
                        checked={terms}
                        onChange={event => setTerms(event.target.checked)}
                      />
                    </div>
                    <Button 
                      disabled={isSubmitting || !terms}
                      variant="primary" 
                      type="submit" 
                      className="w-100 mb-3"
                    >
                      {isSubmitting ? 'Please wait...' : 'Register'}
                    </Button>
                    <div className="d-flex align-items-center justify-content-center">
                      <p className="small mb-0">Already have an account?</p> <Button variant="link" size="sm" onClick={() => navigate('/login')}>Login Here</Button>    
                    </div>
                  </Form>
                 )}
                </Formik>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
      <Modal 
        show={show} 
        onHide={handleClose} 
        animation={false}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Verify Email</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Formik
            initialValues={{
              code: '',
            }}
            validationSchema={Yup.object().shape({
              code: Yup.string().required('Required'),
            })}
            onSubmit={(values, { setSubmitting, setErrors }) => {
              setSubmitting(true);
              setTimeout(() => {
                verifyCode(values, () => {
                  setSubmitting(false);
                }, setErrors);
              }, 400);
            }}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
              isSubmitting,
           }) => (
            <Form onSubmit={handleSubmit} autoComplete="new-off">
              <Form.Group className="mb-3 position-relative">
                <Form.Label>Enter the code sent to {`"${data.email}"`}</Form.Label>
                <Form.Control 
                  type="number"
                  name="code"
                  placeholder="Code"
                  value={values.code}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={errors.code && touched.code && 'is-invalid'}
                />
                {errors.code && touched.code && <Form.Control.Feedback style={{ fontSize: 12 }} className="end-0" type="invalid" tooltip>{errors.code}</Form.Control.Feedback>}
              </Form.Group>
              <Button 
                disabled={isSubmitting} 
                variant="primary" 
                type="submit" 
                className="w-100 mb-3"
              >
                {isSubmitting ? 'Please wait...' : 'Submit'}
              </Button>
              <Button 
                disabled={isSubmitting}
                onClick={resendOTPCode}
                variant="secondary" 
                type="button" 
                className="w-100 mb-3"
              >
                Resend Code
              </Button>
            </Form>
           )}
          </Formik>
        </Modal.Body>
      </Modal>
    </>
  )
}

export default Index;