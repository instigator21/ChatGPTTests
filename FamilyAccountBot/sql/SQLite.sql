-- SQLite
--select * from spendings
--select * from users
SELECT
    currency, 
    SUM(amount) as total 
FROM spendings 
WHERE user_id = 360094739 AND paid_off <> 1
GROUP BY currency