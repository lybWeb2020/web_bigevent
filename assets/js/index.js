$(function () {
    //调用getUserInfo()获取用户的基本信息
    getUserInfo();
    var layer = layui.layer;

    // 点击按钮实现退出功能
    $('#btnLogout').on('click', function () {
        // 提示用户是否确认退出
        layer.confirm('确定退出登录?', { icon: 3, title: '提示' }, function (index) {
            //do something
            //1.清空本地存储的 token
            localStorage.removeItem('token');
            //2.重新跳转登录页面
            location.href = './login.html';
            
            layer.close(index);
        });
    });
});

//获取用户的基本信息
function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        // headers 就是请求头配置对象
        // headers:{
        //     Authorization:localStorage.getItem('token') || ''
        // },
        success: function (res) {
            // console.log('_______________');
            // console.log(res);
            if (res.status !== 0) {
                return layer.msg(res.message);
            }
            // layer.msg('欢迎登录!');
            //调用 renderAvatar 渲染用户的头像
            renderAvatar(res.data);
        },
        //不论成功还是失败，最终都会调用complete 回调函数
        // complete:function(res){
        //     console.log('执行了 complete 回调:');
        //     console.log(res.responseJSON);
        //     //在complete回调函数中，可以使用res.responseJSON拿到服务器响应回来的数据
        //     if(res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！'){
        //         //1.强制清空 token
        //         localStorage.removeItem('token');
        //         //2.强制跳转到登录页面
        //         location.href = './login.html';
        //     }
        // }
    })
}

//渲染用户的头像
function renderAvatar(user) {
    //1.获取用户的昵称
    var name = user.nickname || user.username;
    //设置欢迎的文本
    $('#welcome').html('欢迎&nbsp;  ' + name);
    //3.按需渲染用户头像
    if (user.user_pic !== null) {
        //3.1 渲染图片头像
        $('.layui-nav-img').attr('src', user.user_pic).show();
        $('.text-avatar').hide();
    } else {
        //3.2 渲染文本头像
        $('.layui-nav-img').hide();
        var first = name.substr(0, 1).toUpperCase();
        // console.log(first);
        $('.text-avatar').html(first).show();
    }
}