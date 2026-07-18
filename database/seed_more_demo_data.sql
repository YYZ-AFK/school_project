SET NAMES utf8mb4;
USE bin_text;

START TRANSACTION;

-- 0. Add location fields for sale table when the original SQL does not include them.
SET @has_sale_address := (
  SELECT COUNT(*)
  FROM information_schema.columns
  WHERE table_schema = DATABASE()
    AND table_name = 'sale'
    AND column_name = 'address'
);
SET @sql := IF(@has_sale_address = 0, 'ALTER TABLE sale ADD COLUMN address varchar(255) DEFAULT NULL', 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @has_sale_lng := (
  SELECT COUNT(*)
  FROM information_schema.columns
  WHERE table_schema = DATABASE()
    AND table_name = 'sale'
    AND column_name = 'lng'
);
SET @sql := IF(@has_sale_lng = 0, 'ALTER TABLE sale ADD COLUMN lng double DEFAULT NULL', 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @has_sale_lat := (
  SELECT COUNT(*)
  FROM information_schema.columns
  WHERE table_schema = DATABASE()
    AND table_name = 'sale'
    AND column_name = 'lat'
);
SET @sql := IF(@has_sale_lat = 0, 'ALTER TABLE sale ADD COLUMN lat double DEFAULT NULL', 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

UPDATE permission SET title='医保城市管理' WHERE id=5 OR path='/base/city';

-- 1. Clean obvious test data.
DELETE FROM drug_sale WHERE drug_id = 12650475;
DELETE FROM drug WHERE drug_id = 12650475 OR drug_name REGEXP '^[0-9]+$' OR drug_name LIKE '%测试%';
DELETE FROM drugcompany WHERE company_name REGEXP '^[0-9]+$' OR company_phone REGEXP '^6+$';
DELETE FROM city WHERE city_number IN (100, 0);

-- 2. Replace earlier test doctors with normal demo records.
UPDATE doctor SET name='周明远', age=42, sex=1, level_id=1, phone='13910234567', type_id=1, hospital='青岛第一人民医院', updatetime=NOW() WHERE id=48;
UPDATE doctor SET name='林若晨', age=29, sex=2, level_id=3, phone='13821876540', type_id=2, hospital='青岛第一人民医院', updatetime=NOW() WHERE id=49;
UPDATE doctor SET name='马天宇', age=37, sex=1, level_id=2, phone='13755668901', type_id=9, hospital='青岛第一人民医院', updatetime=NOW() WHERE id=50;
UPDATE doctor SET name='赵雅琪', age=34, sex=2, level_id=1, phone='13677889902', type_id=10, hospital='青岛第一人民医院', updatetime=NOW() WHERE id=53;

-- 3. Add doctors for richer pagination and dashboard charts.
INSERT INTO doctor (id, name, age, sex, level_id, phone, type_id, hospital, createtime, updatetime, account_id) VALUES
(900101,'刘海宁',45,1,1,'13966010001',1,'青岛第一人民医院',NOW(),NOW(),NULL),
(900102,'陈思雨',32,2,2,'13966010002',2,'青岛第一人民医院',NOW(),NOW(),NULL),
(900103,'吴嘉豪',39,1,2,'13966010003',3,'青岛第一人民医院',NOW(),NOW(),NULL),
(900104,'孙悦然',41,2,1,'13966010004',9,'青岛第一人民医院',NOW(),NOW(),NULL),
(900105,'郑凯文',28,1,3,'13966010005',10,'青岛第一人民医院',NOW(),NOW(),NULL),
(900106,'唐雪梅',50,2,1,'13966010006',11,'青岛第一人民医院',NOW(),NOW(),NULL),
(900107,'何志强',47,1,1,'13966010007',12,'青岛第一人民医院',NOW(),NOW(),NULL),
(900108,'蒋梦婷',35,2,2,'13966010008',1,'青岛第一人民医院',NOW(),NOW(),NULL),
(900109,'宋一鸣',30,1,3,'13966010009',2,'青岛第一人民医院',NOW(),NOW(),NULL),
(900110,'梁佳怡',44,2,1,'13966010010',3,'青岛第一人民医院',NOW(),NOW(),NULL),
(900111,'袁浩然',38,1,2,'13966010011',9,'青岛第一人民医院',NOW(),NOW(),NULL),
(900112,'高雨桐',33,2,2,'13966010012',10,'青岛第一人民医院',NOW(),NOW(),NULL),
(900113,'谢文博',46,1,1,'13966010013',11,'青岛第一人民医院',NOW(),NOW(),NULL),
(900114,'罗清雅',31,2,3,'13966010014',12,'青岛第一人民医院',NOW(),NOW(),NULL),
(900115,'程浩宇',52,1,1,'13966010015',1,'青岛第一人民医院',NOW(),NOW(),NULL),
(900116,'许安琪',40,2,2,'13966010016',2,'青岛第一人民医院',NOW(),NOW(),NULL),
(900117,'冯子昂',36,1,2,'13966010017',3,'青岛第一人民医院',NOW(),NOW(),NULL),
(900118,'邓欣怡',29,2,3,'13966010018',9,'青岛第一人民医院',NOW(),NOW(),NULL),
(900119,'沈嘉诚',43,1,1,'13966010019',10,'青岛第一人民医院',NOW(),NOW(),NULL),
(900120,'曹若琳',34,2,2,'13966010020',11,'青岛第一人民医院',NOW(),NOW(),NULL)
ON DUPLICATE KEY UPDATE name=VALUES(name), age=VALUES(age), sex=VALUES(sex), level_id=VALUES(level_id), phone=VALUES(phone), type_id=VALUES(type_id), hospital=VALUES(hospital), updatetime=NOW();

-- 4. Normalize duplicate pharmacy demo rows and add more pharmacies.
UPDATE sale SET sale_name='同仁堂青岛中心药房', sale_phone='13245789012', updatetime=NOW() WHERE sale_id=12635272;
UPDATE sale SET sale_name='益丰大药房市南店', sale_phone='15622334455', updatetime=NOW() WHERE sale_id=12635280;
UPDATE sale SET sale_name='国大药房李沧店', sale_phone='13354449777', updatetime=NOW() WHERE sale_id=12635282;
UPDATE sale SET sale_name='一心堂大药房', sale_phone='15566778899', updatetime=NOW() WHERE sale_id=12635285;
UPDATE sale SET sale_name='健之佳药房', sale_phone='18877889901', updatetime=NOW() WHERE sale_id=12635286;
UPDATE sale SET sale_name='华氏大药房', sale_phone='17766554433', updatetime=NOW() WHERE sale_id=12635287;
UPDATE sale SET sale_name='德生堂药房', sale_phone='16655223344', updatetime=NOW() WHERE sale_id=12635288;
UPDATE sale SET sale_name='康佰馨大药房', sale_phone='18966557788', updatetime=NOW() WHERE sale_id=12635289;
UPDATE sale SET sale_name='成大方圆药房', sale_phone='15811223344', updatetime=NOW() WHERE sale_id=12635290;
UPDATE sale SET sale_name='开心人大药房', sale_phone='15122334455', updatetime=NOW() WHERE sale_id=12635291;
UPDATE sale SET sale_name='百草堂药房', sale_phone='15733445566', updatetime=NOW() WHERE sale_id=12635292;

INSERT INTO sale (sale_id, sale_name, sale_phone, createtime, updatetime) VALUES
(12635293,'九州通大药房','13670010001',NOW(),NOW()),
(12635294,'海慈便民药房','13670010002',NOW(),NOW()),
(12635295,'康复之家药房','13670010003',NOW(),NOW()),
(12635296,'民生连锁药房','13670010004',NOW(),NOW()),
(12635297,'瑞康医药连锁','13670010005',NOW(),NOW()),
(12635298,'康爱多大药房','13670010006',NOW(),NOW()),
(12635299,'普济堂药房','13670010007',NOW(),NOW())
ON DUPLICATE KEY UPDATE sale_name=VALUES(sale_name), sale_phone=VALUES(sale_phone), updatetime=NOW();

UPDATE sale SET address='山东省青岛市市南区香港中路18号', lng=120.38264, lat=36.06708 WHERE sale_id=12635265;
UPDATE sale SET address='山东省青岛市市北区台东三路58号', lng=120.35620, lat=36.08760 WHERE sale_id=12635266;
UPDATE sale SET address='山东省青岛市李沧区九水东路130号', lng=120.43100, lat=36.16080 WHERE sale_id=12635267;
UPDATE sale SET address='山东省青岛市崂山区海尔路182号', lng=120.46750, lat=36.10650 WHERE sale_id=12635268;
UPDATE sale SET address='山东省青岛市黄岛区长江中路266号', lng=120.19780, lat=35.96040 WHERE sale_id=12635269;
UPDATE sale SET address='山东省青岛市城阳区正阳中路205号', lng=120.39630, lat=36.30710 WHERE sale_id=12635270;
UPDATE sale SET address='山东省青岛市即墨区鹤山路599号', lng=120.44700, lat=36.38900 WHERE sale_id=12635271;
UPDATE sale SET address='山东省青岛市市南区山东路10号', lng=120.38480, lat=36.07160 WHERE sale_id=12635272;
UPDATE sale SET address='山东省青岛市市南区南京路8号', lng=120.39420, lat=36.07070 WHERE sale_id=12635280;
UPDATE sale SET address='山东省青岛市李沧区书院路37号', lng=120.42140, lat=36.15870 WHERE sale_id=12635282;
UPDATE sale SET address='山东省青岛市胶州市广州南路167号', lng=120.03310, lat=36.26470 WHERE sale_id=12635285;
UPDATE sale SET address='山东省青岛市平度市人民路88号', lng=119.95900, lat=36.78820 WHERE sale_id=12635286;
UPDATE sale SET address='山东省青岛市莱西市烟台路52号', lng=120.51760, lat=36.88910 WHERE sale_id=12635287;
UPDATE sale SET address='山东省青岛市西海岸新区井冈山路157号', lng=120.19020, lat=35.96310 WHERE sale_id=12635288;
UPDATE sale SET address='山东省青岛市崂山区香港东路195号', lng=120.47850, lat=36.09370 WHERE sale_id=12635289;
UPDATE sale SET address='山东省青岛市市北区辽阳西路100号', lng=120.38140, lat=36.10350 WHERE sale_id=12635290;
UPDATE sale SET address='山东省青岛市城阳区春阳路211号', lng=120.40320, lat=36.31980 WHERE sale_id=12635291;
UPDATE sale SET address='山东省青岛市即墨区蓝鳌路788号', lng=120.45280, lat=36.39140 WHERE sale_id=12635292;
UPDATE sale SET address='山东省青岛市崂山区深圳路222号', lng=120.46880, lat=36.11140 WHERE sale_id=12635293;
UPDATE sale SET address='山东省青岛市市北区人民路4号', lng=120.36670, lat=36.09650 WHERE sale_id=12635294;
UPDATE sale SET address='山东省青岛市市南区太平路51号', lng=120.31940, lat=36.06430 WHERE sale_id=12635295;
UPDATE sale SET address='山东省青岛市黄岛区香江路68号', lng=120.19080, lat=35.96390 WHERE sale_id=12635296;
UPDATE sale SET address='山东省青岛市城阳区长城路89号', lng=120.38950, lat=36.30620 WHERE sale_id=12635297;
UPDATE sale SET address='山东省青岛市李沧区夏庄路1号', lng=120.42900, lat=36.16440 WHERE sale_id=12635298;
UPDATE sale SET address='山东省青岛市胶州市兰州东路210号', lng=120.04280, lat=36.27060 WHERE sale_id=12635299;

-- 5. Add more drug companies.
INSERT INTO drugcompany (company_id, company_name, company_phone, createtime, updatetime) VALUES
(11265482,'北京同仁堂科技发展股份有限公司','01087654321',NOW(),NOW()),
(11265483,'石药集团有限公司','031186543210',NOW(),NOW()),
(11265484,'云南白药集团股份有限公司','087165432100',NOW(),NOW()),
(11265485,'华润三九医药股份有限公司','075586543210',NOW(),NOW()),
(11265486,'以岭药业股份有限公司','031185678901',NOW(),NOW()),
(11265487,'太极集团有限公司','02367890123',NOW(),NOW()),
(11265488,'扬子江药业集团有限公司','052386789012',NOW(),NOW()),
(11265489,'修正药业集团股份有限公司','043186789012',NOW(),NOW()),
(11265490,'天士力医药集团股份有限公司','02287654321',NOW(),NOW()),
(11265491,'鲁南制药集团股份有限公司','053987654321',NOW(),NOW()),
(11265492,'仁和药业股份有限公司','079187654321',NOW(),NOW())
ON DUPLICATE KEY UPDATE company_name=VALUES(company_name), company_phone=VALUES(company_phone), updatetime=NOW();

-- 6. Add cities. city_number maps to sysregion.id.
INSERT INTO city (city_id, city_number, createtime, updatetime) VALUES
(12630293,110100,NOW(),NOW()),
(12630294,120100,NOW(),NOW()),
(12630295,310100,NOW(),NOW()),
(12630296,440100,NOW(),NOW()),
(12630297,440300,NOW(),NOW()),
(12630298,330100,NOW(),NOW()),
(12630299,320100,NOW(),NOW()),
(12630300,420100,NOW(),NOW()),
(12630301,510100,NOW(),NOW()),
(12630302,610100,NOW(),NOW()),
(12630303,500100,NOW(),NOW()),
(12630304,430100,NOW(),NOW()),
(12630305,410100,NOW(),NOW()),
(12630306,370100,NOW(),NOW()),
(12630307,210100,NOW(),NOW()),
(12630308,350200,NOW(),NOW()),
(12630309,350100,NOW(),NOW()),
(12630310,530100,NOW(),NOW()),
(12630311,520100,NOW(),NOW()),
(12630312,450100,NOW(),NOW())
ON DUPLICATE KEY UPDATE city_number=VALUES(city_number), updatetime=NOW();

-- 7. Add policy data.
INSERT INTO medical_policy (id, title, message, city_id, create_time, update_time) VALUES
(1035,'门诊慢特病跨省直接结算流程','参保人员完成备案后，可在定点医疗机构按规定办理门诊慢特病费用直接结算。',12630293,DATE_FORMAT(NOW(),'%Y-%m-%d %H:%i:%s'),DATE_FORMAT(NOW(),'%Y-%m-%d %H:%i:%s')),
(1036,'医保电子凭证使用指引','参保人员可使用医保电子凭证完成挂号、缴费、购药结算等业务。',12630295,DATE_FORMAT(NOW(),'%Y-%m-%d %H:%i:%s'),DATE_FORMAT(NOW(),'%Y-%m-%d %H:%i:%s')),
(1037,'异地就医备案管理办法','长期异地居住人员和临时外出就医人员可通过线上渠道办理备案。',12630296,DATE_FORMAT(NOW(),'%Y-%m-%d %H:%i:%s'),DATE_FORMAT(NOW(),'%Y-%m-%d %H:%i:%s')),
(1038,'住院费用医保报销材料说明','住院报销需提供费用清单、发票、出院记录和身份证明等材料。',12630298,DATE_FORMAT(NOW(),'%Y-%m-%d %H:%i:%s'),DATE_FORMAT(NOW(),'%Y-%m-%d %H:%i:%s')),
(1039,'定点零售药店购药结算规范','参保人在定点药店购药时，应核验处方和医保电子凭证。',12630299,DATE_FORMAT(NOW(),'%Y-%m-%d %H:%i:%s'),DATE_FORMAT(NOW(),'%Y-%m-%d %H:%i:%s')),
(1040,'门诊统筹支付政策','符合条件的门诊费用按当地门诊统筹政策进行支付。',12630300,DATE_FORMAT(NOW(),'%Y-%m-%d %H:%i:%s'),DATE_FORMAT(NOW(),'%Y-%m-%d %H:%i:%s')),
(1041,'居民医保参保缴费提醒','居民医保集中缴费期内完成缴费，次年按规定享受医保待遇。',12630301,DATE_FORMAT(NOW(),'%Y-%m-%d %H:%i:%s'),DATE_FORMAT(NOW(),'%Y-%m-%d %H:%i:%s')),
(1042,'医保目录药品管理说明','医保目录内药品按照甲类、乙类及地方政策执行报销。',12630302,DATE_FORMAT(NOW(),'%Y-%m-%d %H:%i:%s'),DATE_FORMAT(NOW(),'%Y-%m-%d %H:%i:%s'))
ON DUPLICATE KEY UPDATE title=VALUES(title), message=VALUES(message), city_id=VALUES(city_id), update_time=VALUES(update_time);

INSERT INTO company_policy (id, title, message, company_id, create_time, update_time) VALUES
(124591,'药品生产质量追溯要求','药品生产企业应建立批号追溯、出入库记录和质量审核制度。',11265465,NOW(),NOW()),
(124592,'处方药销售合规提示','处方药销售应严格核验处方来源，并保留审方记录。',11265466,NOW(),NOW()),
(124593,'药品冷链运输管理规范','冷链药品运输全过程应记录温度并保留异常处理记录。',11265467,NOW(),NOW()),
(124594,'药品不良反应报告制度','发现疑似不良反应后应按要求及时登记、上报和跟踪。',11265468,NOW(),NOW()),
(124595,'互联网药品信息服务规范','线上展示药品信息应真实、准确，不得夸大疗效。',11265482,NOW(),NOW()),
(124596,'药品召回管理办法','企业发现质量风险后应启动召回评估和分级处置流程。',11265483,NOW(),NOW()),
(124597,'药品广告审查提醒','药品宣传内容应通过合规审查，不得使用绝对化用语。',11265484,NOW(),NOW()),
(124598,'药品储存养护制度','药品库房需按温湿度要求进行分区储存和定期养护。',11265485,NOW(),NOW())
ON DUPLICATE KEY UPDATE title=VALUES(title), message=VALUES(message), company_id=VALUES(company_id), update_time=NOW();

-- 8. Add material data.
INSERT INTO material (id, title, message, create_time, update_time) VALUES
(12,'异地就医备案材料','身份证、医保电子凭证、异地长期居住证明或转诊备案材料。',NOW(),NOW()),
(13,'门诊慢特病认定材料','诊断证明、病历资料、检查报告、近期用药记录。',NOW(),NOW()),
(14,'住院费用报销材料','住院发票、费用清单、出院小结、身份证和银行卡复印件。',NOW(),NOW()),
(15,'药店购药报销材料','医保电子凭证、处方、购药发票和费用明细。',NOW(),NOW()),
(16,'生育保险报销材料','结婚证、出生医学证明、住院发票、费用清单和出院记录。',NOW(),NOW()),
(17,'工伤医疗费用材料','工伤认定书、诊疗记录、费用票据和单位证明。',NOW(),NOW()),
(18,'医保关系转移材料','身份证、参保凭证、转入地接收信息。',NOW(),NOW()),
(19,'门诊统筹报销材料','门诊发票、处方、检查检验报告和医保凭证。',NOW(),NOW()),
(20,'特殊药品申请材料','指定医院诊断证明、专家意见、处方及用药申请表。',NOW(),NOW()),
(21,'长期护理保险申请材料','评估申请表、身份证、病历资料和照护需求证明。',NOW(),NOW())
ON DUPLICATE KEY UPDATE title=VALUES(title), message=VALUES(message), update_time=NOW();

-- 9. Add sale relations for existing six real drugs.
DELETE FROM drug_sale
WHERE drug_id IN (12650466,12650467,12650468,12650469,12650470,12650471)
  AND sale_id IN (12635270,12635271,12635272,12635280,12635282,12635293,12635294,12635295,12635296,12635297,12635298,12635299);

INSERT INTO drug_sale (drug_id, sale_id) VALUES
(12650466,12635293),(12650466,12635294),(12650467,12635295),(12650467,12635296),
(12650468,12635297),(12650468,12635298),(12650469,12635299),(12650469,12635270),
(12650470,12635271),(12650470,12635272),(12650471,12635280),(12650471,12635282);

COMMIT;
