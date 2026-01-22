#!/usr/bin/env node

/**
 * 测试覆盖率报告生成脚本
 * 用于生成详细的测试覆盖率报告并分析测试覆盖情况
 */

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

// 项目根目录
const rootDir = path.resolve(__dirname, '..')

// 覆盖率报告目录
const coverageDir = path.join(rootDir, 'coverage')

// 测试文件统计
function analyzeTestCoverage() {
  console.log('🔍 分析测试覆盖率...')
  
  // 获取所有源文件
  const srcFiles = getAllFiles(path.join(rootDir, 'src'))
    .filter(file => file.endsWith('.ts') || file.endsWith('.tsx'))
    .filter(file => !file.includes('__tests__') && !file.includes('test'))
  
  // 获取所有测试文件
  const testFiles = getAllFiles(path.join(rootDir, 'src'))
    .filter(file => file.includes('.test.') || file.includes('.spec.'))
  
  // 按目录分类
  const coverageByDir = {}
  
  srcFiles.forEach(file => {
    const relativePath = path.relative(path.join(rootDir, 'src'), file)
    const dir = path.dirname(relativePath)
    
    if (!coverageByDir[dir]) {
      coverageByDir[dir] = {
        sourceFiles: 0,
        testFiles: 0,
        sourceFileNames: [],
        testFileNames: []
      }
    }
    
    coverageByDir[dir].sourceFiles++
    coverageByDir[dir].sourceFileNames.push(path.basename(file))
  })
  
  testFiles.forEach(file => {
    const relativePath = path.relative(path.join(rootDir, 'src'), file)
    const dir = path.dirname(relativePath).replace('/__tests__', '')
    
    if (coverageByDir[dir]) {
      coverageByDir[dir].testFiles++
      coverageByDir[dir].testFileNames.push(path.basename(file))
    }
  })
  
  // 生成报告
  console.log('\n📊 测试覆盖率统计:')
  console.log('='.repeat(80))
  
  let totalSourceFiles = 0
  let totalTestFiles = 0
  
  Object.keys(coverageByDir).sort().forEach(dir => {
    const stats = coverageByDir[dir]
    const coverage = stats.testFiles / stats.sourceFiles * 100
    
    console.log(`\n📁 ${dir || '根目录'}:`)
    console.log(`   源文件: ${stats.sourceFiles} 个`)
    console.log(`   测试文件: ${stats.testFiles} 个`)
    console.log(`   覆盖率: ${coverage.toFixed(1)}%`)
    
    // 显示未覆盖的文件
    if (stats.testFiles < stats.sourceFiles) {
      const uncoveredFiles = stats.sourceFileNames.filter(sourceFile => {
        const testFile = sourceFile.replace(/\.[jt]sx?$/, '.test.$&')
        return !stats.testFileNames.includes(testFile)
      })
      
      if (uncoveredFiles.length > 0) {
        console.log(`   ⚠️  未覆盖文件: ${uncoveredFiles.join(', ')}`)
      }
    }
    
    totalSourceFiles += stats.sourceFiles
    totalTestFiles += stats.testFiles
  })
  
  const overallCoverage = totalTestFiles / totalSourceFiles * 100
  
  console.log('\n' + '='.repeat(80))
  console.log(`📈 总体统计:`)
  console.log(`   总源文件: ${totalSourceFiles} 个`)
  console.log(`   总测试文件: ${totalTestFiles} 个`)
  console.log(`   总体覆盖率: ${overallCoverage.toFixed(1)}%`)
  
  // 生成建议
  console.log('\n💡 改进建议:')
  if (overallCoverage < 70) {
    console.log('   ❌ 测试覆盖率较低，建议优先为以下目录添加测试:')
    Object.keys(coverageByDir)
      .filter(dir => coverageByDir[dir].testFiles / coverageByDir[dir].sourceFiles < 0.7)
      .sort((a, b) => {
        const aCoverage = coverageByDir[a].testFiles / coverageByDir[a].sourceFiles
        const bCoverage = coverageByDir[b].testFiles / coverageByDir[b].sourceFiles
        return aCoverage - bCoverage
      })
      .forEach(dir => {
        const stats = coverageByDir[dir]
        const coverage = stats.testFiles / stats.sourceFiles * 100
        console.log(`      - ${dir} (${coverage.toFixed(1)}%)`)
      })
  } else if (overallCoverage < 85) {
    console.log('   ⚠️  测试覆盖率良好，但仍有提升空间')
  } else {
    console.log('   ✅ 测试覆盖率优秀！继续保持')
  }
}

// 递归获取所有文件
function getAllFiles(dir) {
  let results = []
  
  if (!fs.existsSync(dir)) {
    return results
  }
  
  const list = fs.readdirSync(dir)
  
  list.forEach(file => {
    const filePath = path.join(dir, file)
    const stat = fs.statSync(filePath)
    
    if (stat && stat.isDirectory()) {
      // 跳过node_modules和dist目录
      if (file !== 'node_modules' && file !== 'dist') {
        results = results.concat(getAllFiles(filePath))
      }
    } else {
      results.push(filePath)
    }
  })
  
  return results
}

// 运行测试并生成覆盖率报告
function runTestsWithCoverage() {
  console.log('🚀 运行测试并生成覆盖率报告...')
  
  try {
    // 运行测试
    execSync('pnpm test:coverage', { 
      cwd: rootDir, 
      stdio: 'inherit',
      encoding: 'utf8'
    })
    
    console.log('✅ 测试运行完成')
    
    // 分析覆盖率
    analyzeTestCoverage()
    
  } catch (error) {
    console.error('❌ 测试运行失败:', error.message)
    process.exit(1)
  }
}

// 主函数
function main() {
  const args = process.argv.slice(2)
  
  if (args.includes('--analyze-only')) {
    analyzeTestCoverage()
  } else {
    runTestsWithCoverage()
  }
}

if (require.main === module) {
  main()
}

module.exports = {
  analyzeTestCoverage,
  runTestsWithCoverage
}