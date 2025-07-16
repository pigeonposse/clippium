#!/usr/bin/env node

import process from 'node:process'

import { hideBin } from '../src'
import { run }     from './index'

await run( hideBin( process.argv ) )
