/*
Navicat MySQL Data Transfer

Source Server         : localhost_3306
Source Server Version : 80032
Source Host           : localhost:3306
Source Database       : bin_text

Target Server Type    : MYSQL
Target Server Version : 80032
File Encoding         : 65001

Date: 2023-06-16 14:51:07
*/

SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for account
-- ----------------------------
DROP TABLE IF EXISTS `account`;
CREATE TABLE `account`
(
    `id`          bigint NOT NULL AUTO_INCREMENT COMMENT 'id（账号表）',
    `realname`    varchar(255) CHARACTER SET utf8mb4 DEFAULT NULL COMMENT '姓名',
    `uname`       varchar(255) CHARACTER SET utf8mb4 DEFAULT NULL COMMENT '用户名',
    `pwd`         varchar(255) CHARACTER SET utf8mb4 DEFAULT NULL COMMENT '密码',
    `phonenumber` varchar(255) CHARACTER SET utf8mb4 DEFAULT NULL COMMENT '电话号码',
    `utype`       varchar(11) CHARACTER SET utf8mb4  DEFAULT NULL COMMENT '角色类型：1管理员，2医生，3患者',
    `updatetime`  datetime(6)                        DEFAULT NULL COMMENT '更新时间',
    `createtime`  datetime(6)                        DEFAULT NULL COMMENT '创建时间',
    PRIMARY KEY (`id`) USING BTREE,
    UNIQUE KEY `uname_check` (`uname`) USING BTREE COMMENT '用户名唯一'
) ENGINE = InnoDB
  AUTO_INCREMENT = 75
  DEFAULT CHARSET = utf8mb4
  ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of account
-- ----------------------------
INSERT INTO `account`
VALUES ('1', '管理员', 'admin_1', '$2a$10$wP2uEmLmhfzhQMbLMyWgc.tSXTL7w/BarFi2BZwkUFN9X5cec1G.2', '15966723221',
        'ROLE_1', '2021-08-17 21:08:48.000000', '2021-08-17 21:08:52.000000');
INSERT INTO `account`
VALUES ('33', '王小明', '王小明4125', '$2a$10$fPBYIrHSVHk7.3B2NjaRK.Zwy9Mf0Hdll4bEckWon2rHspJlWHuNC', '18356654125',
        'ROLE_2', '2021-08-30 13:54:11.000000', '2021-08-30 13:54:11.000000');
INSERT INTO `account`
VALUES ('38', '小红', '小红2222', '$2a$10$ZFZE6c1VQ/FyZ0S5nAfMQeyKeVGg0xu5fWe4u.YNEHoGD9s/Sl.gK', '12342222222',
        'ROLE_2', '2021-09-02 11:13:59.000000', '2021-09-02 11:13:59.000000');
INSERT INTO `account`
VALUES ('44', '韩峰', '韩峰9283', '$2a$10$hI0jzExg5VLqFhTklvbUfOfvI30NGo3GsokjXdAAngiEa/TFD.Ynm', '13132509283',
        'ROLE_2', '2021-09-02 11:13:59.000000', '2021-09-02 11:13:59.000000');
INSERT INTO `account`
VALUES ('45', '李贺', '李贺3268', '$2a$10$fnjlxSvCO.EaXQOJZBdvVOl08.yukjb0KlH8ks5aBoTgiuu9NTcne', '13682033268',
        'ROLE_2', '2021-09-02 11:13:59.000000', '2021-09-02 11:13:59.000000');
INSERT INTO `account`
VALUES ('46', '祝言之', '祝言之6080', '$2a$10$OcGkxrlo28aS8XOPIzFYde/boLWgoxxuiLQXdgvD9D/nHhV/RzgLy', '15222006080',
        'ROLE_2', '2021-09-02 11:13:59.000000', '2021-09-02 11:13:59.000000');
INSERT INTO `account`
VALUES ('47', '侯吉祥', '侯吉祥5599', '$2a$10$NChe4G2AQbPB9667hBipJ.bIm2/qUzCBG2/AVnSlJ90EIJ4Nsg1nq', '15223365599',
        'ROLE_2', '2021-09-02 11:13:59.000000', '2021-09-02 11:13:59.000000');
INSERT INTO `account`
VALUES ('48', '徐晨光', '徐晨光4599', '$2a$10$QelHgeCAh8kbk7BrebgyLueIxH63WNczYsqp8dXCBZGrFyZFCMk7W', '15232684599',
        'ROLE_2', '2021-09-02 11:13:59.000000', '2021-09-02 11:13:59.000000');
INSERT INTO `account`
VALUES ('49', '陈凯歌', '陈凯歌3231', '$2a$10$b3FgqUR7NG29npo8zxYUX.2KFinR.I/yf9uOGVjCeawwI2qpvk7IG', '15602223231',
        'ROLE_2', '2021-09-02 11:13:59.000000', '2021-09-02 11:13:59.000000');
INSERT INTO `account`
VALUES ('50', '康维斯', '康维斯2107', '$2a$10$VS/Fbm1gwjzCrytLhJ9VfuEQB7UY/BvCyHPHN./TndBb2UpSRwWHm', '15902292107',
        'ROLE_2', '2021-09-02 11:13:59.000000', '2021-09-02 11:13:59.000000');
INSERT INTO `account`
VALUES ('51', '王爱民', '王爱民1331', '$2a$10$VCdBu837s2QYeR2FuY4t6.fncGnYRyafCtO2jCINvQxXJ2pHlBPvq', '18222611331',
        'ROLE_2', '2021-09-02 11:13:59.000000', '2021-09-02 11:13:59.000000');
INSERT INTO `account`
VALUES ('52', '汪扬', '汪扬1234', '$2a$10$mIe6Fc2z9AdP4YYxnu9aK.4AjJQeMYzMSmGsvvfqmHrWy8GbaJkw6', '18622341234',
        'ROLE_2', '2021-09-06 19:17:54.000000', '2021-09-02 11:13:59.000000');
INSERT INTO `account`
VALUES ('64', '黄卫', '黄卫4661', '$2a$10$yGewk0JPxz76WpD09d9TPudl4ecHUhP5sIdO5TZsel9oLo3.Zvr2K', '13116554661',
        'ROLE_2', '2021-10-18 15:54:37.000000', '2021-10-18 15:54:37.000000');
INSERT INTO `account`
VALUES ('72', '李四针', '李四针1148', '$2a$10$kb8BJXsxyoKIjXxijSwlfexQ0GzkZKE1KuEKyJRN7F/58KZ1.DzEW', '15522361148',
        'ROLE_2', '2021-11-22 14:59:46.000000', '2021-11-22 14:59:16.000000');
INSERT INTO `account`
VALUES ('73', '张三', '张三6543', '$2a$10$H6vTjjroFbv6pfraM8lIUeUBecLm5Ib6Hldyed1705ejgB3ttTHmC', '13354446543',
        'ROLE_2', '2021-12-03 11:35:43.000000', '2021-12-03 11:35:43.000000');
INSERT INTO `account`
VALUES ('74', '李四', '李四6555', '$2a$10$c1kiupxJi0LC8tvncrl3V.yhPpN0kvX0ag2icGSIQPK3VpCgmk4ue', '13398886555',
        'ROLE_2', '2021-12-03 11:37:22.000000', '2021-12-03 11:37:22.000000');

-- ----------------------------
-- Table structure for china
-- ----------------------------
DROP TABLE IF EXISTS `china`;
CREATE TABLE `china`
(
    `id`        int NOT NULL,
    `name`      varchar(40) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
    `parent_id` int                                                          DEFAULT NULL,
    PRIMARY KEY (`id`) USING BTREE,
    KEY `FK_CHINA_REFERENCE_CHINA` (`parent_id`) USING BTREE,
    CONSTRAINT `FK_CHINA_REFERENCE_CHINA` FOREIGN KEY (`parent_id`) REFERENCES `china` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb3
  ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of china
-- ----------------------------
INSERT INTO `china`
VALUES ('0', '中国', '0');
INSERT INTO `china`
VALUES ('110000', '北京市', '0');
INSERT INTO `china`
VALUES ('110100', '东城区', '110000');
INSERT INTO `china`
VALUES ('110200', '西城区', '110000');
INSERT INTO `china`
VALUES ('110500', '朝阳区', '110000');
INSERT INTO `china`
VALUES ('110600', '丰台区', '110000');
INSERT INTO `china`
VALUES ('110700', '石景山区', '110000');
INSERT INTO `china`
VALUES ('110800', '海淀区', '110000');
INSERT INTO `china`
VALUES ('110900', '门头沟区', '110000');
INSERT INTO `china`
VALUES ('111100', '房山区', '110000');
INSERT INTO `china`
VALUES ('111200', '通州区', '110000');
INSERT INTO `china`
VALUES ('111300', '顺义区', '110000');
INSERT INTO `china`
VALUES ('111400', '昌平区', '110000');
INSERT INTO `china`
VALUES ('111500', '大兴区', '110000');
INSERT INTO `china`
VALUES ('111600', '怀柔区', '110000');
INSERT INTO `china`
VALUES ('111700', '平谷区', '110000');
INSERT INTO `china`
VALUES ('112800', '密云县', '110000');
INSERT INTO `china`
VALUES ('112900', '延庆县', '110000');
INSERT INTO `china`
VALUES ('120000', '天津市', '0');
INSERT INTO `china`
VALUES ('120100', '和平区', '120000');
INSERT INTO `china`
VALUES ('120200', '河东区', '120000');
INSERT INTO `china`
VALUES ('120300', '河西区', '120000');
INSERT INTO `china`
VALUES ('120400', '南开区', '120000');
INSERT INTO `china`
VALUES ('120500', '河北区', '120000');
INSERT INTO `china`
VALUES ('120600', '红桥区', '120000');
INSERT INTO `china`
VALUES ('120900', '滨海新区', '120000');
INSERT INTO `china`
VALUES ('121000', '东丽区', '120000');
INSERT INTO `china`
VALUES ('121100', '西青区', '120000');
INSERT INTO `china`
VALUES ('121200', '津南区', '120000');
INSERT INTO `china`
VALUES ('121300', '北辰区', '120000');
INSERT INTO `china`
VALUES ('121400', '武清区', '120000');
INSERT INTO `china`
VALUES ('121500', '宝坻区', '120000');
INSERT INTO `china`
VALUES ('122100', '宁河县', '120000');
INSERT INTO `china`
VALUES ('122300', '静海县', '120000');
INSERT INTO `china`
VALUES ('122500', '蓟县', '120000');
INSERT INTO `china`
VALUES ('130000', '河北省', '0');
INSERT INTO `china`
VALUES ('130100', '石家庄市', '130000');
INSERT INTO `china`
VALUES ('130101', '市辖区', '130100');
INSERT INTO `china`
VALUES ('130102', '长安区', '130101');
INSERT INTO `china`
VALUES ('130103', '桥东区', '130101');
INSERT INTO `china`
VALUES ('130104', '桥西区', '130101');
INSERT INTO `china`
VALUES ('130105', '新华区', '130101');
INSERT INTO `china`
VALUES ('130107', '井陉矿区', '130101');
INSERT INTO `china`
VALUES ('130108', '裕华区', '130101');
INSERT INTO `china`
VALUES ('130121', '井陉县', '130100');
INSERT INTO `china`
VALUES ('130123', '正定县', '130100');

-- ----------------------------
-- Table structure for city
-- ----------------------------
DROP TABLE IF EXISTS `city`;
CREATE TABLE `city`
(
    `city_id`     bigint NOT NULL AUTO_INCREMENT COMMENT '城市编号',
    `createtime`  datetime DEFAULT NULL COMMENT '创建时间',
    `updatetime`  datetime DEFAULT NULL COMMENT '更新时间',
    `city_number` int      DEFAULT NULL COMMENT '城市编号',
    PRIMARY KEY (`city_id`) USING BTREE
) ENGINE = InnoDB
  AUTO_INCREMENT = 12630293
  DEFAULT CHARSET = utf8mb4
  ROW_FORMAT = DYNAMIC
  COMPRESSION = 'NONE';

-- ----------------------------
-- Records of city
-- ----------------------------
INSERT INTO `city`
VALUES ('12630252', '2021-09-06 18:47:01', '2021-09-06 18:47:01', '370200');
INSERT INTO `city`
VALUES ('12630254', '2021-09-06 18:47:26', '2021-09-06 18:47:26', '130200');
INSERT INTO `city`
VALUES ('12630255', '2021-09-06 18:47:31', '2021-09-06 18:47:31', '360100');
INSERT INTO `city`
VALUES ('12630260', '2021-09-07 10:43:29', '2021-09-07 10:43:29', '370400');
INSERT INTO `city`
VALUES ('12630282', '2021-11-03 15:10:43', '2021-11-03 15:10:43', '100');
INSERT INTO `city`
VALUES ('12630287', '2021-11-26 10:38:11', '2021-11-26 10:38:11', '340300');
INSERT INTO `city`
VALUES ('12630288', '2021-11-26 11:24:10', '2021-11-26 11:24:10', '140300');
INSERT INTO `city`
VALUES ('12630289', '2021-11-26 11:24:17', '2021-11-26 11:24:17', '150300');
INSERT INTO `city`
VALUES ('12630290', '2021-11-26 11:24:24', '2021-11-26 11:24:24', '220300');
INSERT INTO `city`
VALUES ('12630291', '2021-11-26 11:24:32', '2021-11-26 11:24:32', '320400');
INSERT INTO `city`
VALUES ('12630292', '2021-11-26 11:24:38', '2021-11-26 11:24:38', '320300');

-- ----------------------------
-- Table structure for company_policy
-- ----------------------------
DROP TABLE IF EXISTS `company_policy`;
CREATE TABLE `company_policy`
(
    `id`          bigint NOT NULL AUTO_INCREMENT COMMENT '公司政策主键id',
    `title`       varchar(255) CHARACTER SET utf8mb4 DEFAULT NULL COMMENT '政策标题',
    `message`     text CHARACTER SET utf8mb4 COMMENT '政策内容',
    `company_id`  bigint                             DEFAULT NULL COMMENT '公司id',
    `create_time` datetime                           DEFAULT NULL COMMENT '创建时间',
    `update_time` datetime                           DEFAULT NULL COMMENT '更新时间',
    PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB
  AUTO_INCREMENT = 124603
  DEFAULT CHARSET = utf8mb4
  ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of company_policy
-- ----------------------------
INSERT INTO `company_policy`
VALUES ('124585', '药品上市许可持有人制度', '上市许可持有人和生产许可持有人可以是同一主体', '11265468',
        '2021-09-06 19:05:20', '2021-09-06 19:05:20');
INSERT INTO `company_policy`
VALUES ('124586', '严格生产、销售管制药品', '对管制药品进行严格的管控', '11265465', '2021-09-06 19:05:57',
        '2021-09-06 19:05:57');
INSERT INTO `company_policy`
VALUES ('124589', '进一步降低999感冒灵的成本', '找到了更廉价的供应商', '11265468', '2021-09-06 19:08:03',
        '2021-09-06 19:08:03');
INSERT INTO `company_policy`
VALUES ('124590', '加速疫苗的生产', '要进一步加速疫苗的生产。', '11265466', '2021-09-06 19:08:41',
        '2021-12-01 09:11:12');

-- ----------------------------
-- Table structure for doctor
-- ----------------------------
DROP TABLE IF EXISTS `doctor`;
CREATE TABLE `doctor`
(
    `id`         bigint NOT NULL AUTO_INCREMENT COMMENT 'id(医生信息表)',
    `name`       varchar(255) CHARACTER SET utf8mb4 DEFAULT NULL COMMENT '医生姓名',
    `age`        int                                DEFAULT NULL COMMENT '年龄',
    `sex`        int                                DEFAULT NULL COMMENT '性别：1男，2女',
    `level_id`   bigint                             DEFAULT NULL COMMENT '医师级别id',
    `phone`      varchar(255) CHARACTER SET utf8mb4 DEFAULT NULL COMMENT '联系方式',
    `type_id`    bigint                             DEFAULT NULL COMMENT '诊治类别id',
    `hospital`   varchar(255) CHARACTER SET utf8mb4 DEFAULT '青岛第一人民医院' COMMENT '所属医院',
    `updatetime` datetime(6)                        DEFAULT NULL COMMENT '更新时间',
    `createtime` datetime(6)                        DEFAULT NULL COMMENT '创建时间',
    `account_id` bigint                             DEFAULT NULL COMMENT '账号id',
    PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB
  AUTO_INCREMENT = 51
  DEFAULT CHARSET = utf8mb4
  ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of doctor
-- ----------------------------
INSERT INTO `doctor`
VALUES ('2', '韩峰', '31', '1', '2', '13132509283', '2', '青岛第一人民医院', '2021-08-26 14:11:02.000000',
        '2021-08-26 14:11:02.000000', '44');
INSERT INTO `doctor`
VALUES ('3', '李贺', '36', '1', '1', '13682033268', '3', '青岛第一人民医院', '2021-08-26 14:11:02.000000',
        '2021-08-26 14:11:02.000000', '45');
INSERT INTO `doctor`
VALUES ('4', '祝言之', '54', '1', '1', '15222006080', '1', '青岛第一人民医院', '2021-08-26 14:11:02.000000',
        '2021-08-26 14:11:02.000000', '46');
INSERT INTO `doctor`
VALUES ('5', '侯吉祥', '39', '1', '1', '15223365599', '2', '青岛第一人民医院', '2021-08-26 14:11:02.000000',
        '2021-08-26 14:11:02.000000', '47');
INSERT INTO `doctor`
VALUES ('6', '徐晨光', '39', '1', '2', '15232684599', '3', '青岛第一人民医院', '2021-08-26 14:11:02.000000',
        '2021-08-26 14:11:02.000000', '48');
INSERT INTO `doctor`
VALUES ('7', '陈凯歌', '35', '1', '1', '15602223231', '1', '青岛第一人民医院', '2021-08-26 14:11:02.000000',
        '2021-08-26 14:11:02.000000', '49');
INSERT INTO `doctor`
VALUES ('8', '康维斯', '48', '1', '2', '15902292107', '2', '青岛第一人民医院', '2021-08-26 14:11:02.000000',
        '2021-08-26 14:11:02.000000', '50');
INSERT INTO `doctor`
VALUES ('9', '王爱民', '46', '2', '1', '18222611331', '3', '青岛第一人民医院', '2021-08-26 14:11:02.000000',
        '2021-08-26 14:11:02.000000', '51');
INSERT INTO `doctor`
VALUES ('10', '汪扬', '35', '2', '1', '18622341234', '1', '青岛第一人民医院', '2021-09-06 19:17:54.000000',
        '2021-08-26 14:11:02.000000', '52');
INSERT INTO `doctor`
VALUES ('48', '李四针', '66', '2', '3', '15522361148', '1', '青岛第一人民医院', '2021-11-22 14:59:46.000000',
        '2021-11-22 14:59:16.000000', '72');
INSERT INTO `doctor`
VALUES ('49', '张三', '18', '1', '3', '13354446543', '2', '青岛第一人民医院', '2021-12-03 11:35:43.000000',
        '2021-12-03 11:35:43.000000', '73');
INSERT INTO `doctor`
VALUES ('50', '李四', '19', '2', '2', '13398886555', '9', '青岛第一人民医院', '2021-12-03 11:37:22.000000',
        '2021-12-03 11:37:22.000000', '74');

-- ----------------------------
-- Table structure for doctor_level
-- ----------------------------
DROP TABLE IF EXISTS `doctor_level`;
CREATE TABLE `doctor_level`
(
    `id`   bigint NOT NULL AUTO_INCREMENT,
    `name` varchar(255) CHARACTER SET utf8mb4 DEFAULT NULL,
    PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB
  AUTO_INCREMENT = 4
  DEFAULT CHARSET = utf8mb4
  ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of doctor_level
-- ----------------------------
INSERT INTO `doctor_level`
VALUES ('1', '主任医师');
INSERT INTO `doctor_level`
VALUES ('2', '普通医师');
INSERT INTO `doctor_level`
VALUES ('3', '实习医师');

-- ----------------------------
-- Table structure for drug
-- ----------------------------
DROP TABLE IF EXISTS `drug`;
CREATE TABLE `drug`
(
    `drug_id`     bigint NOT NULL AUTO_INCREMENT COMMENT '药品信息表id',
    `drug_name`   varchar(255) CHARACTER SET utf8mb4 DEFAULT NULL COMMENT '药名',
    `drug_info`   text CHARACTER SET utf8mb4 COMMENT '药品成分信息',
    `drug_effect` text CHARACTER SET utf8mb4 COMMENT '药品功能',
    `drug_img`    varchar(255) CHARACTER SET utf8mb4 DEFAULT NULL COMMENT '药品图片url',
    `createtime`  datetime(6)                        DEFAULT NULL COMMENT '创建时间',
    `updatetime`  datetime(6)                        DEFAULT NULL COMMENT '更新时间',
    `publisher`   varchar(255) CHARACTER SET utf8mb4 DEFAULT NULL COMMENT '发布者',
    PRIMARY KEY (`drug_id`) USING BTREE
) ENGINE = InnoDB
  AUTO_INCREMENT = 12650475
  DEFAULT CHARSET = utf8mb4
  ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of drug
-- ----------------------------
INSERT INTO `drug`
VALUES ('12650466', '复方感冒灵颗粒(双蚁)',
        '金银花、五指柑、野菊花、三叉苦、南板蓝根、岗梅、对乙酰氨基酚、马来酸氨苯那敏、咖啡因。用开水冲服。一次 14 克，一日 3 次；二天为一疗程。辅料为蔗糖。',
        '辛凉解表，清热解毒。用于风热感冒之发热，微恶风寒，头身痛，口干而渴，鼻塞涕浊，咽喉红肿疼痛，咳嗽，痰黄粘稠。',
        'http://localhost:8080/image/ee0f07ff-1287-4c10-9f13-b5427466cbf62112160U345-1-lp.jpg', null,
        '2023-06-16 06:03:12.819000', '管理员');
INSERT INTO `drug`
VALUES ('12650467', '连花清瘟胶囊 (以岭)',
        '连翘、金银花、炙麻黄、炒苦杏仁、石膏、板蓝根、绵马贯众、鱼腥草、广藿香、大黄、红景天、薄荷脑、甘草。辅料为：淀粉。口服。一次 4 粒，一日 3 次。',
        '清瘟解毒，宣肺泄热。用于治疗流行性感冒属热毒袭肺证，症见：发热或高热，恶寒，肌肉酸痛，鼻塞流涕，咳嗽，头痛，咽干咽痛，舌偏红，苔黄或黄腻等。',
        'http://localhost:8080/image/d64ee443-2293-447e-9dcd-afc4193079411605931013851.jpg', null,
        '2023-06-16 06:35:35.117000', '管理员');
INSERT INTO `drug`
VALUES ('12650468', '布洛芬混悬液 (美林)',
        '本品每毫升含主要成分布洛芬 20 毫克，辅料为预胶化淀粉、黄原胶、甘油、蔗糖、无水柠檬、苯甲酸钠、吐温 80、食用色素、食用香精、纯水 。',
        '用于儿童普通感冒或流行性感冒引起的发热。也用于缓解儿童轻至中度疼痛，如头痛、关节痛、偏头痛、牙痛、肌肉痛、神经痛。',
        'http://localhost:8080/image/defdf42e-c0e7-426b-acab-d02fe4e35fa01605931013851.jpg', null,
        '2023-06-16 06:35:55.390000', '管理员');
INSERT INTO `drug`
VALUES ('12650469', '复方对乙酰氨基酚片(散利痛)',
        '本品为复方制剂，每片含对乙酰氨基酚 0.25 克、异丙安替比林 0.15 克、无水咖啡因 50 毫克。辅料为：微晶纤维素、羟丙甲基纤维素、甲醛酪蛋白、玉米淀粉、硬脂酸镁、滑石粉、硅酸。',
        '用于普通感冒或流行性感冒引起的发热，也用于缓解轻至中度疼痛如头痛、关节痛、偏头痛、牙痛、肌肉痛、神经痛、痛经。',
        'http://localhost:8080/image/78fa62da-4f0f-407c-b0aa-d5fe9f29d38edf7f529ae5224643970448596e4f9d084.jpg', null,
        '2021-11-18 17:33:34.000000', '管理员');
INSERT INTO `drug`
VALUES ('12650470', '复方氨酚烷胺片(感叹号)',
        '本品为复方制剂，每片含对乙酰氨基酚 250 毫克，盐酸金刚烷胺 100 毫克，人工牛黄 10 毫克，咖啡因 15 毫克，马来酸氯苯那敏 2 毫克，辅料为：淀粉、硬脂酸镁。',
        '用于缓解普通感冒或流行性感冒引起的发热、头痛、咽痛、鼻塞、打喷嚏等症状。',
        'http://localhost:8080/image/a89a35c7-16b0-465d-ac9a-68d100fe7f82af7a52d5df3e4f8bb40f3e453ecfb64d5.jpg', null,
        '2021-11-18 17:33:48.000000', '管理员');
INSERT INTO `drug`
VALUES ('12650471', '氨咖黄敏胶囊(禾穗速校)',
        '本品为复方制剂，每粒含对乙酰氨基酚 250 毫克，咖啡因 15 毫克，马来酸氯苯那敏 1 毫克，人工牛黄 10 毫克。辅料为：淀粉、蔗糖、滑石粉、氢氧化铝、食用色素。',
        '适用于缓解普通感冒及流行性感冒引起的发热、头痛、四肢酸痛、打喷嚏、流鼻涕、鼻塞、咽痛等症状。',
        'http://localhost:8080/image/90d53017-1433-4c8d-a06f-8a7623de5a63af2e6949d4ee4fd2b5fdd75322dfe6416.jpg', null,
        '2021-11-18 17:34:02.000000', '管理员');

-- ----------------------------
-- Table structure for drugcompany
-- ----------------------------
DROP TABLE IF EXISTS `drugcompany`;
CREATE TABLE `drugcompany`
(
    `company_id`    bigint NOT NULL AUTO_INCREMENT COMMENT '药品公司信息表id',
    `company_name`  varchar(255) CHARACTER SET utf8mb4 DEFAULT NULL COMMENT '公司名',
    `company_phone` varchar(255) CHARACTER SET utf8mb4 DEFAULT NULL COMMENT '公司电话',
    `updatetime`    datetime                           DEFAULT NULL COMMENT '更新时间',
    `createtime`    datetime                           DEFAULT NULL COMMENT '创建时间',
    PRIMARY KEY (`company_id`) USING BTREE
) ENGINE = InnoDB
  AUTO_INCREMENT = 11265482
  DEFAULT CHARSET = utf8mb4
  ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of drugcompany
-- ----------------------------
INSERT INTO `drugcompany`
VALUES ('11265465', '上海医药有限公司', '13465378737', '2021-09-06 18:40:30', '2021-09-06 18:40:30');
INSERT INTO `drugcompany`
VALUES ('11265466', '广州医药集团有限公司', '15235386666', '2021-09-06 18:41:00', '2021-09-06 18:41:00');
INSERT INTO `drugcompany`
VALUES ('11265467', '山东东阿阿胶集团有限责任公司', '18365784765', '2021-09-06 18:41:25', '2021-09-06 18:41:25');
INSERT INTO `drugcompany`
VALUES ('11265468', '哈药集团有限公司', '18653476589', '2021-09-06 18:41:46', '2021-09-06 18:41:46');

-- ----------------------------
-- Table structure for drug_sale
-- ----------------------------
DROP TABLE IF EXISTS `drug_sale`;
CREATE TABLE `drug_sale`
(
    `id`      bigint NOT NULL AUTO_INCREMENT COMMENT '主键id',
    `drug_id` bigint DEFAULT NULL COMMENT '药的名称',
    `sale_id` bigint DEFAULT NULL COMMENT '售卖该药的药店的id',
    PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB
  AUTO_INCREMENT = 224
  DEFAULT CHARSET = utf8mb4
  ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of drug_sale
-- ----------------------------
INSERT INTO `drug_sale`
VALUES ('54', '12650444', '5');
INSERT INTO `drug_sale`
VALUES ('55', '12650444', '6');
INSERT INTO `drug_sale`
VALUES ('56', '12650444', '7');
INSERT INTO `drug_sale`
VALUES ('124', '12650455', '1');
INSERT INTO `drug_sale`
VALUES ('138', '12650464', '1');
INSERT INTO `drug_sale`
VALUES ('139', '12650464', '2');
INSERT INTO `drug_sale`
VALUES ('164', '5', '1');
INSERT INTO `drug_sale`
VALUES ('165', '5', '2');
INSERT INTO `drug_sale`
VALUES ('166', '5', '3');
INSERT INTO `drug_sale`
VALUES ('178', '12650469', '12635268');
INSERT INTO `drug_sale`
VALUES ('179', '12650470', '12635269');
INSERT INTO `drug_sale`
VALUES ('180', '12650470', '12635268');
INSERT INTO `drug_sale`
VALUES ('181', '12650471', '12635270');
INSERT INTO `drug_sale`
VALUES ('182', '12650471', '12635268');
INSERT INTO `drug_sale`
VALUES ('213', '12650466', '12635265');
INSERT INTO `drug_sale`
VALUES ('214', '12650466', '12635267');
INSERT INTO `drug_sale`
VALUES ('215', '12650466', '12635266');
INSERT INTO `drug_sale`
VALUES ('219', '12650467', '12635269');
INSERT INTO `drug_sale`
VALUES ('220', '12650467', '12635268');
INSERT INTO `drug_sale`
VALUES ('221', '12650467', '12635266');
INSERT INTO `drug_sale`
VALUES ('222', '12650468', '12635271');
INSERT INTO `drug_sale`
VALUES ('223', '12650468', '12635270');

-- ----------------------------
-- Table structure for material
-- ----------------------------
DROP TABLE IF EXISTS `material`;
CREATE TABLE `material`
(
    `id`          int NOT NULL AUTO_INCREMENT,
    `title`       varchar(255) CHARACTER SET utf8mb4 DEFAULT NULL,
    `message`     text CHARACTER SET utf8mb4,
    `create_time` datetime                           DEFAULT NULL,
    `update_time` datetime                           DEFAULT NULL,
    PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB
  AUTO_INCREMENT = 15
  DEFAULT CHARSET = utf8mb4
  ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of material
-- ----------------------------
INSERT INTO `material`
VALUES ('1', '门诊报销', '门诊报销携带资料：门诊发票、合作医疗证历本（或病历）。 ', '2021-08-28 10:48:05',
        '2021-08-28 10:48:05');
INSERT INTO `material`
VALUES ('2', '住院报销', '住院报销携带资料：住院发票、合作医疗证历本（或病历）、费用明细清单、出院小结、其它有关证明。',
        '2021-08-28 10:48:05', '2021-08-28 10:48:05');
INSERT INTO `material`
VALUES ('3', '门诊特殊病报销', '门诊特殊病报销携带资料：门诊发票、特殊病种合作医疗证历本。', '2021-08-28 10:48:05',
        '2021-08-28 10:48:05');
INSERT INTO `material`
VALUES ('4', '特殊病种', '办理特殊病种携带资料：特殊病种门诊治疗建议书，合作医疗证历本、病历、有关化验报告单、照片二张。',
        '2021-08-28 10:48:05', '2021-08-28 10:48:05');
INSERT INTO `material`
VALUES ('5', '糖尿病必备材料', '慢性病证明，身份证复印件', null, null);
INSERT INTO `material`
VALUES ('10', '三高病人药品报销', '身份证复印件，慢性病证明，相关的病例', null, null);
INSERT INTO `material`
VALUES ('11', '癌症治疗报销', '本人身份证件，医生签字证明，医院的诊断书', null, null);

-- ----------------------------
-- Table structure for medical_policy
-- ----------------------------
DROP TABLE IF EXISTS `medical_policy`;
CREATE TABLE `medical_policy`
(
    `id`          bigint NOT NULL AUTO_INCREMENT COMMENT '医保政策信息表id',
    `title`       varchar(255) CHARACTER SET utf8mb4 DEFAULT NULL COMMENT '政策标题',
    `message`     text CHARACTER SET utf8mb4 COMMENT '简介',
    `city_id`     bigint                             DEFAULT NULL COMMENT '所属城市id',
    `create_time` varchar(255) CHARACTER SET utf8mb4 DEFAULT NULL COMMENT '创建时间',
    `update_time` varchar(255) CHARACTER SET utf8mb4 DEFAULT NULL COMMENT '更新时间',
    PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB
  AUTO_INCREMENT = 1045
  DEFAULT CHARSET = utf8mb4
  ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of medical_policy
-- ----------------------------
INSERT INTO `medical_policy`
VALUES ('1031', '城乡居民基本医疗保险门诊统筹制度备案',
        '全体参保居民均享受普通门诊待遇。一个医疗保险年度内，普通门诊不设起付线，进入门诊统筹基金支付范围内的医疗费用按50%比例报销（《河南省基本医疗保险药品目录》中规定的乙类药费用按40%比例报销），普通门诊统筹基金年度最高支付限额为260元。 普通门诊实行乡级统筹，在基层定点医疗机构报销。',
        '12630254', '2021-09-06', '2021-11-22');
INSERT INTO `medical_policy`
VALUES ('1034', '完善国家医保谈判药品 “双通道” 管理机制',
        '“双通道” 国家谈判药品纳入医保乙类药品目录范围，实行统一的支付政策，个人先行自付（职工）5%、（居民）10% 后，纳入统筹基金支付范围，实行与住院相同的报销比例。参保人员发生的应由基本医疗保险、大病保险等医疗保障报销的医疗费用由定点医疗机构和定点药店 “一站式” 结算。',
        '12630252', '2021-09-06', '2021-09-06');

-- ----------------------------
-- Table structure for patient
-- ----------------------------
DROP TABLE IF EXISTS `patient`;
CREATE TABLE `patient`
(
    `id`         int NOT NULL COMMENT '患者id',
    `age`        int                                DEFAULT NULL COMMENT '患者年龄',
    `pname`      varchar(255) CHARACTER SET utf8mb4 DEFAULT NULL COMMENT '患者姓名',
    `enter_time` datetime                           DEFAULT NULL COMMENT '入院时间',
    `out_time`   datetime                           DEFAULT NULL COMMENT '出院时间',
    `sex`        int                                DEFAULT NULL COMMENT '性别：1男，2女',
    `state`      int                                DEFAULT NULL COMMENT '状态',
    PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of patient
-- ----------------------------

-- ----------------------------
-- Table structure for permission
-- ----------------------------
DROP TABLE IF EXISTS `permission`;
CREATE TABLE `permission`
(
    `id`        int NOT NULL AUTO_INCREMENT COMMENT '权限id',
    `pid`       int                                DEFAULT NULL COMMENT '父id',
    `name`      varchar(255) CHARACTER SET utf8mb4 DEFAULT NULL COMMENT '菜单名',
    `path`      varchar(255) CHARACTER SET utf8mb4 DEFAULT NULL COMMENT '路径',
    `component` varchar(255) CHARACTER SET utf8mb4 DEFAULT NULL COMMENT '组件',
    `level`     int                                DEFAULT NULL COMMENT '菜单级别',
    `title`     varchar(255) CHARACTER SET utf8mb4 DEFAULT NULL,
    PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB
  AUTO_INCREMENT = 12
  DEFAULT CHARSET = utf8mb4
  ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of permission
-- ----------------------------
INSERT INTO `permission`
VALUES ('1', '0', 'Layout', '/', 'Layout', '0', 'Layout');
INSERT INTO `permission`
VALUES ('2', '1', 'Home', '/home', 'Home', '1', '首页');
INSERT INTO `permission`
VALUES ('3', '1', 'BaseCompany', '/base/company', 'CompanyManage', '1', '医药公司管理');
INSERT INTO `permission`
VALUES ('4', '1', 'BaseSale', '/base/sale', 'SaleManage', '1', '销售地点管理');
INSERT INTO `permission`
VALUES ('5', '1', 'BaseCity', '/base/city', 'CityManage', '1', '医保城市管理');
INSERT INTO `permission`
VALUES ('6', '1', 'ManageDrug', '/manage/drug', 'DrugManage', '1', '药品信息管理');
INSERT INTO `permission`
VALUES ('7', '1', 'MedicalPolicy', '/manage/medical/policy', 'MedicalPolicy', '1', '医保政策管理');
INSERT INTO `permission`
VALUES ('8', '1', 'CompanyPolicy', '/manage/company/policy', 'CompanyPolicy', '1', '医药公司政策管理');
INSERT INTO `permission`
VALUES ('9', '1', 'DoctorManage', '/manage/doctor', 'DoctorManage', '1', '医生信息管理');
INSERT INTO `permission`
VALUES ('10', '1', 'MaterialManage', '/manage/material', 'MaterialManage', '1', '必备材料管理');
INSERT INTO `permission`
VALUES ('11', '0', 'error-404', '/*', '404', '0', '404-页面不存在');

-- ----------------------------
-- Table structure for role_permission
-- ----------------------------
DROP TABLE IF EXISTS `role_permission`;
CREATE TABLE `role_permission`
(
    `id`       int NOT NULL AUTO_INCREMENT,
    `roleName` varchar(11) CHARACTER SET utf8mb4 DEFAULT NULL COMMENT '角色id',
    `per_id`   int                               DEFAULT NULL COMMENT '权限id',
    PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB
  AUTO_INCREMENT = 22
  DEFAULT CHARSET = utf8mb4
  ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of role_permission
-- ----------------------------
INSERT INTO `role_permission`
VALUES ('1', 'ROLE_1', '1');
INSERT INTO `role_permission`
VALUES ('2', 'ROLE_1', '2');
INSERT INTO `role_permission`
VALUES ('3', 'ROLE_1', '3');
INSERT INTO `role_permission`
VALUES ('4', 'ROLE_1', '4');
INSERT INTO `role_permission`
VALUES ('5', 'ROLE_1', '5');
INSERT INTO `role_permission`
VALUES ('6', 'ROLE_1', '6');
INSERT INTO `role_permission`
VALUES ('7', 'ROLE_1', '7');
INSERT INTO `role_permission`
VALUES ('8', 'ROLE_1', '8');
INSERT INTO `role_permission`
VALUES ('9', 'ROLE_1', '9');
INSERT INTO `role_permission`
VALUES ('10', 'ROLE_1', '10');
INSERT INTO `role_permission`
VALUES ('11', 'ROLE_1', '11');
INSERT INTO `role_permission`
VALUES ('12', 'ROLE_2', '1');
INSERT INTO `role_permission`
VALUES ('13', 'ROLE_2', '2');
INSERT INTO `role_permission`
VALUES ('14', 'ROLE_2', '6');
INSERT INTO `role_permission`
VALUES ('15', 'ROLE_2', '7');
INSERT INTO `role_permission`
VALUES ('19', 'ROLE_2', '8');
INSERT INTO `role_permission`
VALUES ('20', 'ROLE_2', '10');
INSERT INTO `role_permission`
VALUES ('21', 'ROLE_2', '11');

-- ----------------------------
-- Table structure for sale
-- ----------------------------
DROP TABLE IF EXISTS `sale`;
CREATE TABLE `sale`
(
    `sale_id`    bigint NOT NULL AUTO_INCREMENT,
    `sale_name`  varchar(255) CHARACTER SET utf8mb4 DEFAULT NULL,
    `sale_phone` varchar(255) CHARACTER SET utf8mb4 DEFAULT NULL,
    `createtime` datetime                           DEFAULT NULL,
    `updatetime` datetime                           DEFAULT NULL,
    PRIMARY KEY (`sale_id`) USING BTREE
) ENGINE = InnoDB
  AUTO_INCREMENT = 12635293
  DEFAULT CHARSET = utf8mb4
  ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of sale
-- ----------------------------
INSERT INTO `sale`
VALUES ('12635265', '老百姓大药房', '13465778999', '2021-09-06 18:43:58', '2021-12-01 09:15:26');
INSERT INTO `sale`
VALUES ('12635266', '海王星辰连锁药店', '17663456777', '2021-09-06 18:44:14', '2021-09-06 18:44:14');
INSERT INTO `sale`
VALUES ('12635267', '漱玉平民大药房', '18765449999', '2021-09-06 18:44:28', '2021-09-06 18:44:28');
INSERT INTO `sale`
VALUES ('12635268', '天士力大药房', '19845699999', '2021-09-06 18:45:09', '2021-09-06 18:45:09');
INSERT INTO `sale`
VALUES ('12635269', '好药师大药房', '18765438888', '2021-09-06 18:45:35', '2021-09-06 18:45:35');
INSERT INTO `sale`
VALUES ('12635270', '万和大药房', '13456578888', '2021-09-06 18:45:55', '2021-09-06 18:45:55');
INSERT INTO `sale`
VALUES ('12635271', '仁和堂大药房', '13576799999', '2021-09-06 18:46:24', '2021-09-06 18:46:24');
INSERT INTO `sale`
VALUES ('12635272', '张三大药房', '15263411130', '2021-10-21 16:57:25', '2021-10-21 16:57:25');
INSERT INTO `sale`
VALUES ('12635280', '李四大药房', '133544497777', '2021-11-18 14:54:18', '2021-11-18 14:54:18');
INSERT INTO `sale`
VALUES ('12635282', '王五大药房', '12233334444', null, '2021-11-18 15:37:42');
INSERT INTO `sale`
VALUES ('12635285', '王五大药房', '12233334444', null, '2021-11-29 09:37:25');
INSERT INTO `sale`
VALUES ('12635286', '王五大药房', '12233334444', null, '2021-11-29 11:53:11');
INSERT INTO `sale`
VALUES ('12635287', '王五大药房', '12233334444', null, '2021-11-30 09:20:29');
INSERT INTO `sale`
VALUES ('12635288', '王五大药房', '12233334444', null, '2021-11-30 10:38:40');
INSERT INTO `sale`
VALUES ('12635289', '王五大药房', '12233334444', null, '2021-11-30 11:34:35');
INSERT INTO `sale`
VALUES ('12635290', '王五大药房', '12233334444', null, '2021-12-01 15:24:03');
INSERT INTO `sale`
VALUES ('12635291', '王五大药房', '12233334444', null, '2021-12-01 20:50:20');
INSERT INTO `sale`
VALUES ('12635292', '王五大药房', '12233334444', null, '2021-12-01 20:50:39');

-- ----------------------------
-- Table structure for sysregion
-- ----------------------------
DROP TABLE IF EXISTS `sysregion`;
CREATE TABLE `sysregion`
(
    `id`         int NOT NULL COMMENT '区域主键',
    `name`       varchar(20) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci  DEFAULT NULL COMMENT '区域编码',
    `parent_id`  int                                                           DEFAULT NULL COMMENT '区域上级标识',
    `SimpleName` varchar(40) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci  DEFAULT NULL COMMENT '地名简称',
    `Level`      int                                                           DEFAULT NULL COMMENT '区域等级',
    `CityCode`   varchar(20) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci  DEFAULT NULL COMMENT '城市编码',
    `ZipCode`    varchar(20) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci  DEFAULT NULL COMMENT '邮政编码',
    `MerName`    varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL COMMENT '组合名称',
    `Lng`        float                                                         DEFAULT NULL COMMENT '经度',
    `Lat`        float                                                         DEFAULT NULL COMMENT '纬度',
    `PinYin`     varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL COMMENT '拼音',
    PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb3
  ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of sysregion
-- ----------------------------
INSERT INTO `sysregion`
VALUES ('100000', '中国', '0', '中国', '0', '', '', '中国', '116.368', '39.9151', 'China');
INSERT INTO `sysregion`
VALUES ('110000', '北京', '100000', '北京', '1', '', '', '中国,北京', '116.405', '39.905', 'Beijing');
INSERT INTO `sysregion`
VALUES ('110100', '北京市', '110000', '北京', '2', '010', '100000', '中国,北京,北京市', '116.405', '39.905', 'Beijing');
INSERT INTO `sysregion`
VALUES ('110101', '东城区', '110100', '东城', '3', '010', '100010', '中国,北京,北京市,东城区', '116.41', '39.9316',
        'Dongcheng');
INSERT INTO `sysregion`
VALUES ('110102', '西城区', '110100', '西城', '3', '010', '100032', '中国,北京,北京市,西城区', '116.36', '39.9305',
        'Xicheng');
INSERT INTO `sysregion`
VALUES ('110105', '朝阳区', '110100', '朝阳', '3', '010', '100020', '中国,北京,北京市,朝阳区', '116.485', '39.9484',
        'Chaoyang');

-- ----------------------------
-- Table structure for treat_type
-- ----------------------------
DROP TABLE IF EXISTS `treat_type`;
CREATE TABLE `treat_type`
(
    `id`   bigint NOT NULL AUTO_INCREMENT COMMENT '诊治类型id',
    `name` varchar(255) CHARACTER SET utf8mb4 DEFAULT NULL COMMENT '诊治类型名',
    PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB
  AUTO_INCREMENT = 13
  DEFAULT CHARSET = utf8mb4
  ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of treat_type
-- ----------------------------
INSERT INTO `treat_type`
VALUES ('1', '肩部');
INSERT INTO `treat_type`
VALUES ('2', '踝部');
INSERT INTO `treat_type`
VALUES ('3', '膝部');
INSERT INTO `treat_type`
VALUES ('9', '腰部');
INSERT INTO `treat_type`
VALUES ('10', '头部');
INSERT INTO `treat_type`
VALUES ('11', '肘部');
INSERT INTO `treat_type`
VALUES ('12', '腿部');
