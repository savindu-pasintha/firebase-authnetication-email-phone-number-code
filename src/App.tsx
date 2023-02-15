import React, { useContext, useRef, useEffect, useState } from 'react'
import { Button, Col, Container, Form, Navbar } from 'react-bootstrap'
import { auth } from './firebase_auth/firebaseSetup'
import { AuthContext } from './firebase_auth/FirebaseAuthContext'
import { getAuth, RecaptchaVerifier } from 'firebase/auth'
import { Link } from 'react-router-dom'
import { json } from 'stream/consumers'
import { stringify } from 'querystring'

function App() {
  const user = useContext(AuthContext)

  const emailRef = useRef('')
  const passwordRef = useRef('')
  const [number, setNumber] = useState('')
  const [error, setError] = useState('')
  const [otp, setOtp] = useState('')
  const [result, setResult] = useState<any>({ confirm: (value: any) => {} })

  const [flag, setFlag] = useState(false)

  const createAccount = async () => {
    try {
      await auth.createUserWithEmailAndPassword(
        emailRef.current,
        passwordRef.current,
      )
    } catch (error) {
      console.log('error createAccount', error)
    }
  }

  const signIn = async () => {
    try {
      await auth.signInWithEmailAndPassword(
        emailRef.current,
        passwordRef.current,
      )
    } catch (error) {
      console.log('error signIn', error)
    }
  }

  const getOtp = async () => {
    console.log(number)
    setError('')
    if (number === '' || number === undefined)
      return setError('Please enter a valid phone number!')
    try {
      const response: any = await setUpRecaptha(number)
      console.log('getOTP response: ', response)
      window.localStorage.setItem('res', JSON.stringify(response))
      setResult(response)
      setFlag(true)
    } catch (err) {
      console.log('error getOtp', err)
    }
  }

  //sent otp
  function setUpRecaptha(number: string) {
    //open the recaptcha
    const recaptchaVerifier = new RecaptchaVerifier(
      'recaptcha-container',
      {},
      getAuth(),
    )
    recaptchaVerifier.render()
    return auth.signInWithPhoneNumber(number, recaptchaVerifier)
  }

  //verify
  const verifyOtp = async () => {
    // console.log('verify otp res', result)
    setError('')
    if (otp === '' || otp === null) return
    try {
      console.log('verify OTP: ', result, otp)
      // const abc: Object = await result?.confirm(otp)
      const ress: any = window.localStorage.getItem('res')
      const res: any = JSON.parse(ress)

      const abc: any = await result.confirm(otp)

      if (abc) {
        console.log('abc verify otp : ', abc)
      }
    } catch (err) {
      console.log('error verifyOtp', err)
    }
  }

  const signOut = async () => {
    await auth.signOut()
  }

  return (
    <>
      <h2 className="mb-3">Firebase Phone Auth</h2>

      <Form style={{ display: 'block' }}>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <input
            //   defaultCountry="IN"
            type="text"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            placeholder="Enter Phone Number"
          />
          <div id="recaptcha-container"></div>
        </Form.Group>
        <div className="button-right">
          {/* <Link to="/">
            <Button variant="secondary">Cancel</Button>
          </Link> */}
          &nbsp;
          <Button variant="primary" onClick={(e) => getOtp()}>
            Send Otp
          </Button>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <input
              //   defaultCountry="IN"
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter otp"
            />
            <div id="recaptcha-container"></div>
          </Form.Group>
          <Button variant="primary" onClick={(e) => verifyOtp()}>
            Verify
          </Button>
        </div>
      </Form>
      {/* ------otp----- */}
      <Navbar className="justify-content-between" bg="dark" variant="dark">
        <Navbar.Brand>Firebase Authentication</Navbar.Brand>
        {user && <Button onClick={signOut}>Sign Out</Button>}
      </Navbar>
      {!user ? (
        <Container style={{ maxWidth: '500px' }} fluid>
          <Form className="mt-4">
            <Form.Group controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                onChange={(e) => {
                  emailRef.current = e.target.value
                }}
                type="email"
                placeholder="email"
              />
            </Form.Group>
            <Form.Group controlId="formPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                onChange={(e) => {
                  passwordRef.current = e.target.value
                }}
                type="password"
                placeholder="password"
              />
            </Form.Group>
            <Form>
              <Col xs={6}>
                <Button onClick={createAccount} type="button">
                  Sign Up
                </Button>
              </Col>
              <Col xs={6}>
                <Button onClick={signIn} type="button" variant="secondary">
                  Sign In
                </Button>
              </Col>
            </Form>
          </Form>
        </Container>
      ) : (
        <h2 className="mt-4 text-center">Welcome {user.email}</h2>
      )}
    </>
  )
}

export default App
