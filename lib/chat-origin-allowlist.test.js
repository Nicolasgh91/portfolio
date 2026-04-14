import assert from 'node:assert/strict';
import test from 'node:test';
import {
  isLocalOrigin,
  isVercelDeploymentOrigin,
  vercelDeploymentHostnames,
} from './chat-origin-allowlist.js';

test('isLocalOrigin: permite localhost y 127.0.0.1 con puerto (http/https)', () => {
  assert.equal(isLocalOrigin('http://localhost:4321'), true);
  assert.equal(isLocalOrigin('https://localhost'), true);
  assert.equal(isLocalOrigin('http://127.0.0.1:3000'), true);
  assert.equal(isLocalOrigin('http://[::1]:8080'), true);
});

test('isLocalOrigin: rechaza subdominio que contiene localhost como substring', () => {
  assert.equal(isLocalOrigin('https://localhost.evil.example'), false);
});

test('isLocalOrigin: rechaza origen inválido o esquema no http(s)', () => {
  assert.equal(isLocalOrigin(''), false);
  assert.equal(isLocalOrigin('not-a-url'), false);
  assert.equal(isLocalOrigin('ftp://localhost:21'), false);
});

test('vercelDeploymentHostnames: incluye project.vercel.app y URLs de sistema', () => {
  const hosts = vercelDeploymentHostnames({
    VERCEL_PROJECT_NAME: 'MyProj',
    VERCEL_URL: 'https://myproj-abc-team.vercel.app/extra',
    VERCEL_BRANCH_URL: 'myproj-git-feature-team.vercel.app',
  });
  assert.ok(hosts.has('myproj.vercel.app'));
  assert.ok(hosts.has('myproj-abc-team.vercel.app'));
  assert.ok(hosts.has('myproj-git-feature-team.vercel.app'));
});

test('isVercelDeploymentOrigin: solo https y hostname en allowlist', () => {
  const env = {
    VERCEL_PROJECT_NAME: 'foo',
    VERCEL_URL: 'foo-git-main-acme.vercel.app',
    VERCEL_BRANCH_URL: undefined,
  };
  assert.equal(isVercelDeploymentOrigin('https://foo-git-main-acme.vercel.app', env), true);
  assert.equal(isVercelDeploymentOrigin('https://foo.vercel.app', env), true);
  assert.equal(isVercelDeploymentOrigin('http://foo.vercel.app', env), false);
});

test('isVercelDeploymentOrigin: no permite host solo por prefijo de proyecto', () => {
  const env = {
    VERCEL_PROJECT_NAME: 'foo',
    VERCEL_URL: 'foo-git-main-acme.vercel.app',
  };
  assert.equal(isVercelDeploymentOrigin('https://foo-bar.vercel.app', env), false);
});

test('isVercelDeploymentOrigin: sin env de despliegue, solo canonical project host', () => {
  const env = { VERCEL_PROJECT_NAME: 'only', VERCEL_URL: '', VERCEL_BRANCH_URL: '' };
  assert.equal(isVercelDeploymentOrigin('https://only.vercel.app', env), true);
  assert.equal(isVercelDeploymentOrigin('https://only-git-x-y.vercel.app', env), false);
});
