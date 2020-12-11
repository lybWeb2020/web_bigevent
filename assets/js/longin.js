$(function () {
    // 点击去注册账号的链接
    $('#link_reg').on('click', function () {
        $('.login-box').hide();
        $('.reg-box').show();
    });
    // 点击去登录的链接
    $('#link_login').on('click', function () {
        $('.reg-box').hide();
        $('.login-box').show();
    });

    //从layUI中获取form对象
    var form = layui.form;
    var layer = layui.layer;
    //通过form.verify()函数自定义校验规则
    form.verify({
        // 自定义了一个密码校验
        pwd: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        // 校验两次密码是否一致的规则
        repwd: function (value) {
            // 通过形参拿到的是确认密码框中的内容
            //还需要拿到密码框中的内容
            var pwd = $('.reg-box [name=password]').val();
            // console.log(repwd);
            if (pwd !== value) {
                return '两次密码不一致!'
            }
        }
    });

    //监听注册表单的提交事件
    $('#form_reg').on('submit', function (e) {
        // 阻止默认提交行为
        e.preventDefault();
        //2.发起Ajax的post请求
        var data = { username: $('#form_reg [name = username]').val(), password: $('#form_reg [name = password]').val() };
        $.post('/api/reguser', data, function (res) {
            console.log(res);
            if (res.status !== 0) {
                return layer.msg(res.message);
            }
            layer.msg('注册成功,请登录!');
            //模拟人的点击行为
            $('#link_login').click();
        })
    });

    //监听登录表单的提交事件
    // $('#form_login').on('submit',function(e){
    //     //1.阻止默认提交行为
    //     e.preventDefault();
    //     //2.发起Ajax的post请求
    //     var data = { username: $('#form_login [name = username]').val(), password: $('#form_login [name = password]').val() };
    //     $.post('http://ajax.frontend.itheima.net/api/login',data,function(res){
    //         console.log(res);
    //         if(res.status !== 0){
    //             return layer.msg(res.message);
    //         }
    //         layer.msg('欢迎登录!');
    //     });
    // });

    //监听登录表单的提交事件
    $('#form_login').on('submit',function(e){
        //1.阻止默认提交行为
        e.preventDefault();
        //2.发起Ajax的post请求
        $.ajax({
            method:'POST',
            url:'/api/login',
            //快速获取表单中的数据
            data:$(this).serialize(),
            success:function(res){
                console.log(res);
                if(res.status !== 0){
                    return layer.msg(res.message);
                }
                layer.msg('欢迎登录!');
                //将登录成功得到的token 字符串保存到localStorage中
                localStorage.setItem('token',res.token);
                // console.log(localStorage.getItem('token'));
                //跳转到后台主页
                location.href = './index.html';
                
            }
        })
    });
});