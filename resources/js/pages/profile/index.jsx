import { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Card, Pagination, Table, Modal } from 'react-bootstrap';
import { useUpdateProfileMutation, useUpdatePasswordMutation } from 'src/redux/services/profile'; 
import { useSendOTPCodeMutation, useVerifyOTPCodeAndUpdateEmailMutation } from 'src/redux/services/register'; 
import { useDispatch } from 'react-redux';
import { storeUser } from 'src/redux/reducers/user';
import { updateState } from 'src/redux/updateState';
import { useAuth } from 'src/hooks/useAuth';
import { Formik } from 'formik';
import * as Yup from 'yup';
import moment from 'moment';
import { useAntMessage } from 'src/context/ant-message';
import Loader from 'src/shared/loader';
import Avatar from './Avatar';
import { confirm } from 'src/shared/confirm';
import { barangays } from 'src/constants/barangays';

function ChangePassword() {
  const auth = useAuth();
  const antMessage = useAntMessage();
  const [updatePassword] = useUpdatePasswordMutation();

  const submit = async (values, callback, setErrors, resetForm) => {
    try {
      const response = await updatePassword(values).unwrap();
      resetForm({
        password: '',
        password_confirmation: '',
      });
      antMessage.success('Password Updated Successfully!');
      callback();
    } catch (error) {
      console.log(error);
      callback();
    }
  };

  return (
    <Card className="border-0 mb-3 bg-transparent">
      <Card.Header className="border-0 small bg-transparent">Account Data</Card.Header>
      <Card.Body className="llu-bg-gray">
        <Formik
          initialValues={{
            password: '',
            password_confirmation: '',
          }}
          validationSchema={Yup.object().shape({
            password: Yup.string().required('Required'),
            password_confirmation: Yup.string().required('Required').oneOf([Yup.ref('password'), null], 'Passwords must match')
          })}
          onSubmit={(values, { setSubmitting, setErrors, resetForm }) => {
            setSubmitting(true);
             setTimeout(() => {
              submit(values, () => {
                setSubmitting(false);
              }, setErrors, resetForm);
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
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3 position-relative">
              <div className="d-flex justify-content-between align-items-center">
                <Form.Label>Email</Form.Label>
                <Button 
                  size="sm" 
                  variant="link"
                  onClick={async () => {
                    const confirmResponse = await confirm({ 
                      title: 'Change Email', 
                      confirmation: '',
                      confirmButtonText: 'Submit',
                      cancelButtonText: 'Cancel',
                      inputs: [
                        { 
                          label: 'Email', 
                          type: 'email', 
                          name: 'email',
                        }
                      ],
                    });
                    if (confirmResponse) {
                      try {
                        const response = await sendOTPCode({ first_name: auth.getCurrentUser.first_name, ...confirmResponse }).unwrap();
                        if (response.success) {
                          handleShow();
                          setEmail(confirmResponse.email);
                          setToken(response.token);
                          antMessage.success(response.message);
                        } else {
                          antMessage.error(response.message);
                        }
                      } catch (error) {
                        console.log(error);
                      }
                    }
                  }}
                >
                  Change Email
                </Button>
              </div>
              <Form.Control 
                type="text"
                name="email"
                placeholder="Email"
                value={auth.getCurrentUser.email}
                readOnly
                disabled
              />
            </Form.Group>
            <Form.Group className="mb-3 position-relative">
              <Form.Label>Password</Form.Label>
              <Form.Control 
                type="password" 
                name="password"
                placeholder="Password"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                className={errors.password && touched.password && 'is-invalid'}
              />
              {errors.password && touched.password && <Form.Control.Feedback style={{ fontSize: 12 }} className="end-0" type="invalid" tooltip>{errors.password}</Form.Control.Feedback>}
            </Form.Group>
            <Form.Group className="mb-3 position-relative">
              <Form.Label>Password Confirmation</Form.Label>
              <Form.Control 
                type="password" 
                name="password_confirmation"
                placeholder="Password Confirmation"
                value={values.password_confirmation}
                onChange={handleChange}
                onBlur={handleBlur}
                className={errors.password_confirmation && touched.password_confirmation && 'is-invalid'}
              />
              {errors.password_confirmation && touched.password_confirmation && <Form.Control.Feedback style={{ fontSize: 12 }} className="end-0" type="invalid" tooltip>{errors.password_confirmation}</Form.Control.Feedback>}
            </Form.Group>
            <div className="d-flex justify-content-end align-items-center">
              <Button 
                variant="primary"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Please wait...' : 'Update'}
              </Button>
            </div>
          </Form>
         )}
        </Formik>
      </Card.Body>
    </Card>
  )
}

function Index() {
  const auth = useAuth();
  const dispatch = useDispatch();
  const [updateProfile] = useUpdateProfileMutation();
  const [sendOTPCode] = useSendOTPCodeMutation();
  const [verifyOTPCodeAndUpdateEmail] = useVerifyOTPCodeAndUpdateEmailMutation();
  const antMessage = useAntMessage();
  const [email, setEmail] = useState('');
  const [token, setToken] = useState({});
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);

  const handleShow = () => setShow(true);

  const submit = async (values, callback, setErrors) => {
    try {
      const response = await updateProfile(values).unwrap();
      if (response.success) {
        await dispatch(updateState(storeUser(response.user)));
        antMessage.success(response.message);
      } else {
        antMessage.error(response.message);
      }
      callback();
    } catch (error) {
      if (error.status === 422) {
        setErrors(error.data.errors);
      }
      callback();
    }
  };

  const resendOTPCode  = async () => {
    try {
      const response = await sendOTPCode({ first_name: auth.getCurrentUser.first_name, email }).unwrap();
      if (response.success) {
        setToken(response.token);
        antMessage.success(response.message);
      } else {
        antMessage.error(response.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const verifyCode  = async (values, callback, setErrors) => {
    try {
      const response = await verifyOTPCodeAndUpdateEmail({ token, email, ...values }).unwrap();
      console.log(response);
      if (response.success) {
        auth.update();
        handleClose();
        antMessage.success(response.message);
      } else {
        antMessage.error(response.message);
      }
      callback();
    } catch(error) {
      console.log(error);
      callback();
    }
  };

  return (
    <>
      <Container>
        <Row>
          <Col md={3}>
            <Card className="border-0 mb-3 bg-transparent">
              <Card.Header className="border-0 small bg-transparent">Profile Photo</Card.Header>
              <Card.Body className="llu-bg-gray">
                <div className="mb-3">
                  <Avatar />
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={9}>
            <Card className="border-0 mb-3 bg-transparent">
              <Card.Header className="border-0 small bg-transparent">Basic Information</Card.Header>
              <Card.Body className="llu-bg-gray">
                <Formik
                  initialValues={{
                    first_name: '',
                    last_name: '',
                    gender: '',
                    date_of_birth: '',
                    address: '',
                    barangay: '',
                    street: '',
                    ...auth.getCurrentUser
                  }}
                  validationSchema={Yup.object().shape({
                    first_name: Yup.string().required('Required'),
                    last_name: Yup.string().required('Required'),
                    gender: Yup.string().required('Required'),
                    date_of_birth: Yup.string().required('Required'),
                    address: Yup.string().required('Required'),
                    barangay: Yup.string().required('Required'),
                    street: Yup.string().required('Required'),
                  })}
                  onSubmit={(values, { setSubmitting, setErrors }) => {
                    setSubmitting(true);
                     setTimeout(() => {
                      submit(values, () => {
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
                  <Form onSubmit={handleSubmit}>
                    <Row>
                      <Col md={4}>
                        <Form.Group className="mb-3 position-relative">
                          <Form.Label>First Name</Form.Label>
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
                          <Form.Label>Last Name</Form.Label>
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
                          <Form.Label>Gender</Form.Label>
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
                          <Form.Label>Date of Birth</Form.Label>
                          <Form.Control
                            max={moment().format('YYYY-MM-DD')}
                            type="date"
                            name="date_of_birth"
                            placeholder="Date of Birth."
                            value={values.date_of_birth}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={errors.date_of_birth && touched.date_of_birth && 'is-invalid'}
                          />
                          {errors.date_of_birth && touched.date_of_birth && <Form.Control.Feedback style={{ fontSize: 12 }} className="end-0" type="invalid" tooltip>{errors.date_of_birth}</Form.Control.Feedback>}
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3 position-relative">
                          <Form.Label>Barangay <span className="text-danger">*</span></Form.Label>
                          <Form.Select
                            name="barangay"
                            value={values.barangay}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={errors.barangay && touched.barangay && 'is-invalid'}
                          >
                            <option value="">Select Barangay</option>
                            {barangays.map(item => <option key={item} value={item}>{item}</option>)}
                          </Form.Select>
                          {errors.barangay && touched.barangay && <Form.Control.Feedback style={{ fontSize: 12 }} className="end-0" type="invalid" tooltip>{errors.barangay}</Form.Control.Feedback>}
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3 position-relative">
                          <Form.Label>Street <span className="text-danger">*</span></Form.Label>
                          <Form.Control 
                            type="text"
                            name="street"
                            placeholder="Street"
                            value={values.street}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={errors.street && touched.street && 'is-invalid'}
                          />
                          {errors.street && touched.street && <Form.Control.Feedback style={{ fontSize: 12 }} className="end-0" type="invalid" tooltip>{errors.street}</Form.Control.Feedback>}
                        </Form.Group>
                      </Col>
                    </Row>
                    <Form.Group className="mb-3 position-relative">
                      <Form.Label>Full Address <span className="text-danger">*</span></Form.Label>
                      <Form.Control 
                        as="textarea"
                        name="address"
                        placeholder="Address"
                        value={values.address}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={errors.address && touched.address && 'is-invalid'}
                      />
                      {errors.address && touched.address && <Form.Control.Feedback style={{ fontSize: 12 }} className="end-0" type="invalid" tooltip>{errors.address}</Form.Control.Feedback>}
                    </Form.Group>
                    <div className="d-flex justify-content-end align-items-center">
                      <Button 
                        variant="primary"
                        type="submit"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? 'Please wait...' : 'Update'}
                      </Button>
                    </div>
                  </Form>
                 )}
                </Formik>
              </Card.Body>
            </Card>
            <ChangePassword />
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
                <Form.Label>Enter the code sent to {`"${email}"`}</Form.Label>
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