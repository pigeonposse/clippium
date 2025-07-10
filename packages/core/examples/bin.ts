#!/usr/bin/env node

import { hiddenBin } from 'clippium'
import process       from 'node:process'

import { run } from './index'

await run( hiddenBin( process.argv ) )
