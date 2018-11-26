package cn.edu360.web.controller;


import cn.edu360.web.entity.Bike;
import cn.edu360.web.service.BikeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@RequestMapping("/bike")
public class BikeController {

    /**
     * 按类型注入依赖
     */
    @Autowired
    private BikeService bikeService;

    @RequestMapping("/hello")
    @ResponseBody
    public String test(String msg) {
        return "hello " + msg;
    }

    @RequestMapping("/add")
    @ResponseBody
    public void save(@RequestBody Bike bike) { //@RequestBody接收的是json类型的参数
        bikeService.save(bike);
    }


}
