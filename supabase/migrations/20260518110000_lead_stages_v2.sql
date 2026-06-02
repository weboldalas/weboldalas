-- Rename pipeline stages to new values
UPDATE leads SET status = 'felkeresendo'  WHERE status IN ('hideg_hivas', 'new');
UPDATE leads SET status = 'felkeresve'    WHERE status IN ('erdeklodo', 'contacted');
UPDATE leads SET status = 'ajanlat_kint'  WHERE status IN ('bemutato', 'meeting', 'ajanlat_kint');
UPDATE leads SET status = 'fuggoben'      WHERE status = 'targyalas';
UPDATE leads SET status = 'elfogadott'    WHERE status IN ('nyert', 'won');
UPDATE leads SET status = 'elutasitott'   WHERE status IN ('elveszett', 'lost');
