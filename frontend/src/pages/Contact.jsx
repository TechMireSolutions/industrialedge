import { useMemo } from 'react'
import PageHeader from '../components/PageHeader.jsx'
import useWow from '../hooks/useWow.js'
import { useSettings } from '../context/SettingsContext'

export default function Contact() {
  useWow()

  const { settings } = useSettings()

  const contact = settings?.contact || {}

  const parseList = (value) => {
    if (!value) return []

    // If backend already returns an array
    if (Array.isArray(value)) {
      return value
    }

    // If backend returns a JSON string
    if (typeof value === 'string') {
      try {
        const parsed = JSON.parse(value)

        if (Array.isArray(parsed)) {
          return parsed
        }

        return [parsed]
      } catch {
        // Support comma-separated values
        return value
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean)
      }
    }

    return [String(value)]
  }

  const addresses = useMemo(
    () => parseList(contact.addresses),
    [contact.addresses]
  )

  const emails = useMemo(
    () => parseList(contact.emails),
    [contact.emails]
  )

  const phones = useMemo(
    () => parseList(contact.phones),
    [contact.phones]
  )

  return (
    <>
      <PageHeader title="Contact Us" crumb="Contact" />

      <div className="container-fluid contact py-5">
        <div className="container py-5">
          <div className="p-5 bg-light rounded">
            <div className="row g-4">

              <div className="col-12">
                <div
                  className="text-center mx-auto wow fadeInUp"
                  data-wow-delay="0.1s"
                  style={{ maxWidth: 900 }}
                >
                  <h4 className="text-primary border-bottom border-primary border-2 d-inline-block pb-2">
                    Get in touch
                  </h4>

                  <p className="mb-5 fs-5 text-dark">
                    We are here for you! How can we help?
                  </p>
                </div>
              </div>

              {/* Contact Form */}
              <div className="col-lg-7">

                <h5
                  className="text-primary wow fadeInUp"
                  data-wow-delay="0.1s"
                >
                  Let's Connect
                </h5>

                <h1
                  className="display-5 mb-4 wow fadeInUp"
                  data-wow-delay="0.3s"
                >
                  Send Your Message
                </h1>

                <p
                  className="mb-4 wow fadeInUp"
                  data-wow-delay="0.5s"
                >
                  Have a question or need assistance?
                  Send us a message and our team will get back to you.
                </p>

                <form>
                  <div
                    className="row g-4 wow fadeInUp"
                    data-wow-delay="0.1s"
                  >

                    <div className="col-lg-12 col-xl-6">
                      <div className="form-floating">
                        <input
                          type="text"
                          className="form-control"
                          id="name"
                          placeholder="Your Name"
                        />
                        <label htmlFor="name">
                          Your Name
                        </label>
                      </div>
                    </div>

                    <div className="col-lg-12 col-xl-6">
                      <div className="form-floating">
                        <input
                          type="email"
                          className="form-control"
                          id="email"
                          placeholder="Your Email"
                        />
                        <label htmlFor="email">
                          Your Email
                        </label>
                      </div>
                    </div>

                    <div className="col-lg-12 col-xl-6">
                      <div className="form-floating">
                        <input
                          type="tel"
                          className="form-control"
                          id="phone"
                          placeholder="Phone"
                        />
                        <label htmlFor="phone">
                          Your Phone
                        </label>
                      </div>
                    </div>

                    <div className="col-lg-12 col-xl-6">
                      <div className="form-floating">
                        <input
                          type="text"
                          className="form-control"
                          id="project"
                          placeholder="Project"
                        />
                        <label htmlFor="project">
                          Your Project
                        </label>
                      </div>
                    </div>

                    <div className="col-12">
                      <div className="form-floating">
                        <input
                          type="text"
                          className="form-control"
                          id="subject"
                          placeholder="Subject"
                        />
                        <label htmlFor="subject">
                          Subject
                        </label>
                      </div>
                    </div>

                    <div className="col-12">
                      <div className="form-floating">
                        <textarea
                          className="form-control"
                          placeholder="Leave a message here"
                          id="message"
                          style={{ height: 160 }}
                        />

                        <label htmlFor="message">
                          Message
                        </label>
                      </div>
                    </div>

                    <div className="col-12">
                      <button
                        type="submit"
                        className="btn btn-primary w-100 py-3"
                      >
                        Send Message
                      </button>
                    </div>

                  </div>
                </form>

              </div>

              {/* Map */}
              <div className="col-lg-5 wow fadeInUp" data-wow-delay="0.2s">
                <div className="h-100 rounded">

                  <iframe
                    className="rounded w-100"
                    style={{
                      height: '100%',
                      minHeight: 400
                    }}
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d387191.33750346623!2d-73.97968099999999!3d40.6974881!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2sbd!4v1694259649153!5m2!1sen!2sbd"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Map"
                  />

                </div>
              </div>

              {/* Dynamic Contact Cards */}
              <div className="col-lg-12">

                <div className="row g-4 align-items-stretch justify-content-center">

                  {/* Address */}
                  {addresses.length > 0 && (
                    <div
                      className="col-md-6 col-lg-6 col-xl-3 wow fadeInUp"
                      data-wow-delay="0.1s"
                    >
                      <div className="rounded p-4">

                        <div
                          className="rounded-circle bg-secondary d-flex align-items-center justify-content-center mb-4"
                          style={{
                            width: 70,
                            height: 70
                          }}
                        >
                          <i
                            className="fas fa-map-marker-alt fa-2x text-white"
                            style={{ lineHeight: 1 }}
                          ></i>
                        </div>

                        <h4>Address</h4>

                        {addresses.map((address, index) => (
                          <p
                            key={index}
                            className="mb-2 text-dark"
                          >
                            {address}
                          </p>
                        ))}

                      </div>
                    </div>
                  )}

                  {/* Email */}
                  {emails.length > 0 && (
                    <div
                      className="col-md-6 col-lg-6 col-xl-3 wow fadeInUp"
                      data-wow-delay="0.3s"
                    >
                      <div className="rounded p-4">

                        <div
                          className="rounded-circle bg-secondary d-flex align-items-center justify-content-center mb-4"
                          style={{
                            width: 70,
                            height: 70
                          }}
                        >
                          <i
                            className="fas fa-envelope fa-2x text-white"
                            style={{ lineHeight: 1 }}
                          ></i>
                        </div>

                        <h4>Mail Us</h4>

                        {emails.map((email, index) => (
                          <p
                            key={index}
                            className="mb-2"
                          >
                            <a
                              href={`mailto:${email}`}
                              className="text-dark"
                            >
                              {email}
                            </a>
                          </p>
                        ))}

                      </div>
                    </div>
                  )}

                  {/* Phone */}
                  {phones.length > 0 && (
                    <div
                      className="col-md-6 col-lg-6 col-xl-3 wow fadeInUp"
                      data-wow-delay="0.5s"
                    >
                      <div className="rounded p-4">

                        <div
                          className="rounded-circle bg-secondary d-flex align-items-center justify-content-center mb-4"
                          style={{
                            width: 70,
                            height: 70
                          }}
                        >
                          <i
                            className="fas fa-phone fa-2x text-white"
                            style={{ lineHeight: 1 }}
                          ></i>
                        </div>

                        <h4>Telephone</h4>

                        {phones.map((phone, index) => (
                          <p
                            key={index}
                            className="mb-2"
                          >
                            <a
                              href={`tel:${phone.replace(/\s+/g, '')}`}
                              className="text-dark"
                            >
                              {phone}
                            </a>
                          </p>
                        ))}

                      </div>
                    </div>
                  )}

                  {/* Social Media */}
                  {contact.socialLinks && (
                    <div
                      className="col-md-6 col-lg-6 col-xl-3 wow fadeInUp"
                      data-wow-delay="0.7s"
                    >
                      <div className="rounded p-4">

                        <div
                          className="rounded-circle bg-secondary d-flex align-items-center justify-content-center mb-4"
                          style={{
                            width: 70,
                            height: 70,
                            minWidth: 70,
                            minHeight: 70
                          }}
                        >
                          <i className="fas fa-globe fa-2x text-white"></i>
                        </div>

                        <h4>Follow Us</h4>

                        <div className="d-flex align-items-center gap-2 flex-wrap">

                          {Object.entries(
                            (() => {
                              try {
                                if (
                                  typeof contact.socialLinks === 'object'
                                ) {
                                  return contact.socialLinks
                                }

                                return JSON.parse(
                                  contact.socialLinks
                                )
                              } catch {
                                return {}
                              }
                            })()
                          ).map(([platform, url]) => (

                            <a
                              key={platform}
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn btn-primary rounded-circle d-flex align-items-center justify-content-center p-0"
                              style={{
                                width: 42,
                                height: 42,
                                minWidth: 42,
                                minHeight: 42,
                                lineHeight: 1
                              }}
                              aria-label={platform}
                            >
                              <i
                                className={`fab fa-${platform}`}
                                style={{
                                  fontSize: '1rem',
                                  lineHeight: 1,
                                  margin: 0
                                }}
                              ></i>
                            </a>

                          ))}

                        </div>

                      </div>
                    </div>
                  )}

                </div>

              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  )
}