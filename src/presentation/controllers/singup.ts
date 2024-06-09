import { httpRequest, httpResponse } from '../protocols/http'
import { MissingParamError } from '../errors/missing-param-error'
import { badRequest } from '../helpers/http-helper'
import { Controller } from '../protocols/controller'
import { EmailValidator } from '../protocols/email-validator'
import { InvalidParamError } from '../errors/invalid-param-error'

export class SignUpController implements Controller {
  private readonly validateEmail: EmailValidator

  constructor(validateEmail: EmailValidator) {
    this.validateEmail = validateEmail
  }

  handle(httpRequest: httpRequest): httpResponse {
    const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
    for (const field of requiredFields) {
      if (!httpRequest.body[field]) {
        return badRequest(new MissingParamError(field))
      }
    }

    const isValid = this.validateEmail.isValid(httpRequest.body['email'])
    if (!isValid) return badRequest(new InvalidParamError('email'))
  }
}
