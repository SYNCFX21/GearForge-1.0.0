#!/bin/bash
find src -type f -name "*.tsx" -o -name "*.ts" | xargs sed -i 's/var(--color-brand-cyan)/var(--theme-color)/g'
find src -type f -name "*.tsx" -o -name "*.ts" | xargs sed -i 's/var(--color-brand-blue)/var(--theme-color)/g'
