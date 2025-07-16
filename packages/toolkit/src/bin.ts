#!/usr/bin/env node

import { hideBin } from 'clippium'
import process       from 'node:process'

import { run } from './index'

await run( hideBin( process.argv ) )
