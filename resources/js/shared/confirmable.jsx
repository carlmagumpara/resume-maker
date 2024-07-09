import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { confirmable } from 'react-confirm';
import { Button, Modal, Form } from 'react-bootstrap';

import { Formik } from 'formik';
import * as Yup from 'yup';

const Dialog = ({ show, confirmButtonText = 'Yes', cancelButtonText = 'No', proceed, title, confirmation, options, inputs = [] }) => {
  const [loading, setLoading] = useState(false);

  if (inputs.length) {
    return (
      <Modal 
        show={show} 
        onHide={() => proceed(false)}
        animation={false}
        centered
      >
        <Modal.Header className="border-0" closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
          <Formik
            initialValues={inputs.reduce((o, c) => {
              o[c.name] = '';
              return o;
            }, {})}
            validationSchema={Yup.object().shape(inputs.reduce((o, c) => {
              o[c.name] = Yup.string().required('Required');
              return o;
            }, {}))}
            onSubmit={(values, { setSubmitting }) => {
              setSubmitting(true);
              setTimeout(() => {
                setSubmitting(false);
                proceed(values);
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
              <Modal.Body>
                {inputs.map(input => (
                  <Form.Group className="mb-3 position-relative">
                    <Form.Label>{input.label}</Form.Label>
                    <Form.Control
                      {...input}
                      placeholder={input.label}
                      value={values[input.name]}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={errors[input.name] && touched[input.name] && 'is-invalid'}
                    />
                    {errors[input.name] && touched[input.name] && <Form.Control.Feedback style={{ fontSize: 12 }} className="end-0" type="invalid" tooltip>{errors[input.name]}</Form.Control.Feedback>}
                  </Form.Group>
                ))}
              </Modal.Body>
              <Modal.Footer className="border-0">
                <Button 
                  variant="secondary" 
                  onClick={() => proceed(false)}
                >
                  {cancelButtonText}
                </Button>
                <Button 
                  variant="danger" 
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Please wait...' : confirmButtonText}
                </Button>
              </Modal.Footer>
            </Form>
         )}
        </Formik>
      </Modal>
    )
  }

  return (
    <Modal 
      show={show} 
      onHide={() => proceed(false)}
      animation={false}
      centered
    >
      <Modal.Header className="border-0 justify-content-center align-items-center">
        <Modal.Title className="text-center">{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-center">
        <p>{confirmation}</p>
      </Modal.Body>
      <Modal.Footer className="border-0 justify-content-center align-items-center">
        <Button 
          variant="secondary" 
          onClick={() => proceed(false)}
        >
          {cancelButtonText}
        </Button>
        <Button 
          variant="danger" 
          onClick={() => {
            setLoading(true);
            setTimeout(() => {
              setLoading(false);
              proceed(true);
            }, 2000);
          }}
          disabled={loading}
        >
          {loading ? 'Please wait...' : confirmButtonText}
        </Button>
      </Modal.Footer>
    </Modal>
  )
};

Dialog.propTypes = {
  inputs: PropTypes.array,
  show: PropTypes.bool,            // from confirmable. indicates if the dialog is shown or not.
  proceed: PropTypes.func,         // from confirmable. call to close the dialog with promise resolved.
  title: PropTypes.string,
  confirmation: PropTypes.string,  // arguments of your confirm function
  options: PropTypes.object        // arguments of your confirm function
};

// confirmable HOC pass props `show`, `dismiss`, `cancel` and `proceed` to your component.
export default confirmable(Dialog);