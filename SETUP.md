# Project Setup Guide

## Prerequisites
- Node.js 18.17+ (use `nvm use` if .nvmrc exists)
- npm 9+ or yarn 3+

## Installation Order
1. `npm install` (installs exact versions from package-lock.json)
2. `npm run build` (verify build works)
3. `npm run dev` (start development)

## Troubleshooting
- Delete node_modules and package-lock.json, then reinstall
- Check peer dependency warnings carefully
- Run `npm ls` to identify version conflicts