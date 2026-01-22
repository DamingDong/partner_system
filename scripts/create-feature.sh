#!/bin/bash

# 创建新功能分支的快速脚本
# 用法: ./scripts/create-feature.sh feature-name

if [ -z "$1" ]; then
    echo "错误: 请提供功能分支名称"
    echo "用法: ./scripts/create-feature.sh feature-name"
    exit 1
fi

FEATURE_NAME=$1
BRANCH_NAME="feature/$FEATURE_NAME"

echo "🚀 创建新功能分支: $BRANCH_NAME"

# 切换到develop分支并拉取最新代码
echo "📥 切换到develop分支并拉取最新代码..."
git checkout develop
git pull origin develop

# 创建新的功能分支
echo "🌿 创建功能分支: $BRANCH_NAME"
git checkout -b $BRANCH_NAME

# 推送到远程
echo "📤 推送分支到远程仓库..."
git push -u origin $BRANCH_NAME

echo "✅ 功能分支 $BRANCH_NAME 创建完成！"
echo ""
echo "📋 下一步："
echo "1. 开始开发您的功能"
echo "2. 提交代码: git commit -m 'feat($FEATURE_NAME): 功能描述'"
echo "3. 推送代码: git push origin $BRANCH_NAME"
echo "4. 在GitHub上创建PR到develop分支"