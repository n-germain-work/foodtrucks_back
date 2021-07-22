const express = require('express');

require('dotenv').config({ path: '../../.env' });

const connection = require('../../db-config');

const router = express.Router({
  mergeParams: true,
});

router.get('/all', (req, res) => {
  connection.query('SELECT * FROM truck', (error, result) => {
    if (error) {
      res.status(500).send(error);
    } else {
      res.status(200).send({
        result,
      });
    }
  });
});

router.get('/name_type', (req, res) => {
  const { name, type } = req.body;
  const nameLike = `%${name}%`;
  const typeLike = `%${type}%`;
  console.log(nameLike, typeLike);
  connection.query(
    `SELECT * FROM truck WHERE name LIKE ? OR type LIKE ?`,
    [nameLike, typeLike],
    (error, result) => {
      if (error) {
        res.status(500).send(error);
      } else {
        res.status(200).send({
          result,
        });
      }
    }
  );
});

// renvoit un array filtrer selon n'importe quelle combinaison de type, cp, weekday, meal, voire aucun paramètre => utiliser pour la map Leaflet
router.post('/filter', (req, res) => {
  const { type, cp, weekday, meal } = req.body;
  const sqlParams = [];
  const typeLike = `%${type}%`;
  const cpLike = `%${cp}%`;
  let sql = `SELECT name, phone, type, weekday, start, end, meal, postal_code, latitude,longitude FROM truck
  JOIN truck_has_sale_point ON truck.id = truck_has_sale_point.truck_id
  JOIN sale_point ON truck_has_sale_point.sale_point_id = sale_point.id`;
  if (type || cp || weekday || meal) {
    sql += ' WHERE';
    if (type) {
      sql += ' type LIKE ?';
      sqlParams.push(typeLike);
    }
    if (cp) {
      if (!type) {
        sql += ' postal_code LIKE ?';
      } else {
        sql += ' AND postal_code LIKE ?';
      }
      sqlParams.push(cpLike);
    }
    if (weekday) {
      if (!type && !cp) {
        sql += ' weekday = ?';
      } else {
        sql += ' AND weekday = ?';
      }
      sqlParams.push(weekday);
    }
    if (meal) {
      if (!type && !cp && !weekday) {
        sql += ' meal = ?';
      } else {
        sql += ' AND meal = ?';
      }
      sqlParams.push(meal);
    }
  }
  console.log(sql);
  console.log(sqlParams);
  connection.query(sql, sqlParams, (error, result) => {
    if (error) {
      res.status(500).send(error);
    } else {
      console.log(result);
      res.status(200).send({
        result,
      });
    }
  });
});

module.exports = router;
