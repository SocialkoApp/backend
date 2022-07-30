import { Identity, Session } from '@ory/kratos-client';
import { Request } from 'express';
import { RequestContext } from 'nestjs-request-context';

interface Traits {
  email: string;
  name: {
    first: string;
    last: string;
  };
}

type RequestWithSession = Request & { session: SessionWithTraits };

type SessionWithTraits = Omit<Session, 'identity'> & {
  identity: IdentityWithTraits;
};

type IdentityWithTraits = Omit<Identity, 'traits'> & { traits: Traits };

export function getSession(): SessionWithTraits {
  if (!RequestContext.currentContext) {
    return null;
  }
  const req = RequestContext.currentContext.req as RequestWithSession;
  return req.session;
}

export function getUser(): IdentityWithTraits {
  return getSession().identity;
}

export function getUserId(): string {
  return getSession().identity.id;
}
