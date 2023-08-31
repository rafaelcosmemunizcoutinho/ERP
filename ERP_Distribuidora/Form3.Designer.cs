namespace cadastro_livro
{
    partial class Form3
    {
        /// <summary>
        /// Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        /// Clean up any resources being used.
        /// </summary>
        /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows Form Designer generated code

        /// <summary>
        /// Required method for Designer support - do not modify
        /// the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            System.Windows.Forms.ColumnHeader columnPrecoCompra;
            this.comboTipoCompra = new System.Windows.Forms.ComboBox();
            this.label4 = new System.Windows.Forms.Label();
            this.buttonRemovProdCompra = new System.Windows.Forms.Button();
            this.label3 = new System.Windows.Forms.Label();
            this.listViewProdAddCompra = new System.Windows.Forms.ListView();
            this.columnId = new System.Windows.Forms.ColumnHeader();
            this.columnNome = new System.Windows.Forms.ColumnHeader();
            this.columnCategoria = new System.Windows.Forms.ColumnHeader();
            this.columnTamanho = new System.Windows.Forms.ColumnHeader();
            this.columnQtd = new System.Windows.Forms.ColumnHeader();
            this.columnValor = new System.Windows.Forms.ColumnHeader();
            this.listViewProdCompra = new System.Windows.Forms.ListView();
            this.columnIdPro = new System.Windows.Forms.ColumnHeader();
            this.columnNomeProd = new System.Windows.Forms.ColumnHeader();
            this.columnCatPro = new System.Windows.Forms.ColumnHeader();
            this.columnTam = new System.Windows.Forms.ColumnHeader();
            this.columnQuantProd = new System.Windows.Forms.ColumnHeader();
            this.buttonAddProdCompra = new System.Windows.Forms.Button();
            this.listViewFornecedor = new System.Windows.Forms.ListView();
            this.id = new System.Windows.Forms.ColumnHeader();
            this.col_name = new System.Windows.Forms.ColumnHeader();
            this.col_representante = new System.Windows.Forms.ColumnHeader();
            this.columnFixo = new System.Windows.Forms.ColumnHeader();
            this.columnDivida = new System.Windows.Forms.ColumnHeader();
            this.textBox2 = new System.Windows.Forms.TextBox();
            this.buttonBuscaClienteVenda = new System.Windows.Forms.Button();
            this.buttonLimparCompra = new System.Windows.Forms.Button();
            this.label2 = new System.Windows.Forms.Label();
            this.textPrecoCompra = new System.Windows.Forms.TextBox();
            this.quantProdCompra = new System.Windows.Forms.NumericUpDown();
            this.label1 = new System.Windows.Forms.Label();
            this.buttonRegistraCompra = new System.Windows.Forms.Button();
            this.textBuscaProduto = new System.Windows.Forms.TextBox();
            this.buttonBuscaProd = new System.Windows.Forms.Button();
            this.Fornecedor = new System.Windows.Forms.Label();
            this.fornecedor_anonimo = new System.Windows.Forms.CheckBox();
            this.textFornecedor = new System.Windows.Forms.TextBox();
            this.label5 = new System.Windows.Forms.Label();
            columnPrecoCompra = new System.Windows.Forms.ColumnHeader();
            ((System.ComponentModel.ISupportInitialize)(this.quantProdCompra)).BeginInit();
            this.SuspendLayout();
            // 
            // columnPrecoCompra
            // 
            columnPrecoCompra.Text = "Preço Compra";
            // 
            // comboTipoCompra
            // 
            this.comboTipoCompra.Enabled = false;
            this.comboTipoCompra.FormattingEnabled = true;
            this.comboTipoCompra.Items.AddRange(new object[] {
            "Boleto",
            "Pix",
            "Cartão - Débito",
            "Cartão - Crédito"});
            this.comboTipoCompra.Location = new System.Drawing.Point(311, 278);
            this.comboTipoCompra.Name = "comboTipoCompra";
            this.comboTipoCompra.Size = new System.Drawing.Size(149, 23);
            this.comboTipoCompra.TabIndex = 44;
            // 
            // label4
            // 
            this.label4.AutoSize = true;
            this.label4.Location = new System.Drawing.Point(311, 260);
            this.label4.Name = "label4";
            this.label4.Size = new System.Drawing.Size(90, 15);
            this.label4.TabIndex = 43;
            this.label4.Text = "Tipo da compra";
            this.label4.TextAlign = System.Drawing.ContentAlignment.TopCenter;
            // 
            // buttonRemovProdCompra
            // 
            this.buttonRemovProdCompra.Enabled = false;
            this.buttonRemovProdCompra.Location = new System.Drawing.Point(311, 197);
            this.buttonRemovProdCompra.Name = "buttonRemovProdCompra";
            this.buttonRemovProdCompra.Size = new System.Drawing.Size(285, 23);
            this.buttonRemovProdCompra.TabIndex = 42;
            this.buttonRemovProdCompra.Text = "Remover";
            this.buttonRemovProdCompra.UseVisualStyleBackColor = true;
            this.buttonRemovProdCompra.Click += new System.EventHandler(this.buttonRemovProdCompra_Click);
            // 
            // label3
            // 
            this.label3.AutoSize = true;
            this.label3.Location = new System.Drawing.Point(311, 19);
            this.label3.Name = "label3";
            this.label3.Size = new System.Drawing.Size(124, 15);
            this.label3.TabIndex = 41;
            this.label3.Text = "Produtos Adicionados";
            this.label3.TextAlign = System.Drawing.ContentAlignment.TopCenter;
            // 
            // listViewProdAddCompra
            // 
            this.listViewProdAddCompra.Columns.AddRange(new System.Windows.Forms.ColumnHeader[] {
            this.columnId,
            this.columnNome,
            this.columnCategoria,
            this.columnTamanho,
            this.columnQtd,
            this.columnValor});
            this.listViewProdAddCompra.FullRowSelect = true;
            this.listViewProdAddCompra.Location = new System.Drawing.Point(311, 40);
            this.listViewProdAddCompra.Name = "listViewProdAddCompra";
            this.listViewProdAddCompra.Size = new System.Drawing.Size(285, 149);
            this.listViewProdAddCompra.TabIndex = 40;
            this.listViewProdAddCompra.UseCompatibleStateImageBehavior = false;
            this.listViewProdAddCompra.View = System.Windows.Forms.View.Details;
            this.listViewProdAddCompra.SelectedIndexChanged += new System.EventHandler(this.listViewProdAddCompra_Click);
            // 
            // columnId
            // 
            this.columnId.Text = "id";
            this.columnId.Width = 0;
            // 
            // columnNome
            // 
            this.columnNome.Text = "Nome";
            // 
            // columnCategoria
            // 
            this.columnCategoria.Text = "Categoria";
            // 
            // columnTamanho
            // 
            this.columnTamanho.Text = "tamanho";
            // 
            // columnQtd
            // 
            this.columnQtd.Text = "Quantidade";
            // 
            // columnValor
            // 
            this.columnValor.Text = "Valor";
            // 
            // listViewProdCompra
            // 
            this.listViewProdCompra.Columns.AddRange(new System.Windows.Forms.ColumnHeader[] {
            this.columnIdPro,
            this.columnNomeProd,
            this.columnCatPro,
            this.columnTam,
            columnPrecoCompra,
            this.columnQuantProd});
            this.listViewProdCompra.FullRowSelect = true;
            this.listViewProdCompra.Location = new System.Drawing.Point(12, 40);
            this.listViewProdCompra.Name = "listViewProdCompra";
            this.listViewProdCompra.Size = new System.Drawing.Size(285, 149);
            this.listViewProdCompra.TabIndex = 39;
            this.listViewProdCompra.UseCompatibleStateImageBehavior = false;
            this.listViewProdCompra.View = System.Windows.Forms.View.Details;
            this.listViewProdCompra.SelectedIndexChanged += new System.EventHandler(this.listViewProdCompra_Click);
            // 
            // columnIdPro
            // 
            this.columnIdPro.Text = "id";
            this.columnIdPro.Width = 0;
            // 
            // columnNomeProd
            // 
            this.columnNomeProd.Text = "Nome";
            // 
            // columnCatPro
            // 
            this.columnCatPro.Text = "Categoria";
            // 
            // columnTam
            // 
            this.columnTam.Text = "Tamanho";
            // 
            // columnQuantProd
            // 
            this.columnQuantProd.Text = "Quantidade";
            this.columnQuantProd.Width = 40;
            // 
            // buttonAddProdCompra
            // 
            this.buttonAddProdCompra.Enabled = false;
            this.buttonAddProdCompra.Location = new System.Drawing.Point(65, 197);
            this.buttonAddProdCompra.Name = "buttonAddProdCompra";
            this.buttonAddProdCompra.Size = new System.Drawing.Size(232, 23);
            this.buttonAddProdCompra.TabIndex = 38;
            this.buttonAddProdCompra.Text = "Add";
            this.buttonAddProdCompra.UseVisualStyleBackColor = true;
            this.buttonAddProdCompra.Click += new System.EventHandler(this.buttonAddProdCompra_Click);
            // 
            // listViewFornecedor
            // 
            this.listViewFornecedor.Columns.AddRange(new System.Windows.Forms.ColumnHeader[] {
            this.id,
            this.col_name,
            this.col_representante,
            this.columnFixo,
            this.columnDivida});
            this.listViewFornecedor.FullRowSelect = true;
            this.listViewFornecedor.Location = new System.Drawing.Point(12, 265);
            this.listViewFornecedor.Name = "listViewFornecedor";
            this.listViewFornecedor.Size = new System.Drawing.Size(285, 109);
            this.listViewFornecedor.TabIndex = 37;
            this.listViewFornecedor.UseCompatibleStateImageBehavior = false;
            this.listViewFornecedor.View = System.Windows.Forms.View.Details;
            this.listViewFornecedor.SelectedIndexChanged += new System.EventHandler(this.listViewFornecedor_Click);
            // 
            // id
            // 
            this.id.Text = "id";
            this.id.Width = 25;
            // 
            // col_name
            // 
            this.col_name.Text = "Nome";
            this.col_name.Width = 75;
            // 
            // col_representante
            // 
            this.col_representante.Text = "Representante";
            this.col_representante.Width = 90;
            // 
            // columnFixo
            // 
            this.columnFixo.Text = "Fixo";
            this.columnFixo.Width = 45;
            // 
            // columnDivida
            // 
            this.columnDivida.Text = "Divida";
            this.columnDivida.Width = 45;
            // 
            // textBox2
            // 
            this.textBox2.Location = new System.Drawing.Point(85, 236);
            this.textBox2.Name = "textBox2";
            this.textBox2.PlaceholderText = "Nome do Fornecedor";
            this.textBox2.Size = new System.Drawing.Size(131, 23);
            this.textBox2.TabIndex = 36;
            // 
            // buttonBuscaClienteVenda
            // 
            this.buttonBuscaClienteVenda.Location = new System.Drawing.Point(222, 236);
            this.buttonBuscaClienteVenda.Name = "buttonBuscaClienteVenda";
            this.buttonBuscaClienteVenda.Size = new System.Drawing.Size(75, 23);
            this.buttonBuscaClienteVenda.TabIndex = 35;
            this.buttonBuscaClienteVenda.Text = "Buscar Cliente";
            this.buttonBuscaClienteVenda.UseVisualStyleBackColor = true;
            // 
            // buttonLimparCompra
            // 
            this.buttonLimparCompra.Location = new System.Drawing.Point(466, 351);
            this.buttonLimparCompra.Name = "buttonLimparCompra";
            this.buttonLimparCompra.Size = new System.Drawing.Size(127, 23);
            this.buttonLimparCompra.TabIndex = 34;
            this.buttonLimparCompra.Text = "Limpar/Redefinir";
            this.buttonLimparCompra.UseVisualStyleBackColor = true;
            this.buttonLimparCompra.Click += new System.EventHandler(this.buttonLimparCompra_Click);
            // 
            // label2
            // 
            this.label2.AutoSize = true;
            this.label2.Location = new System.Drawing.Point(311, 304);
            this.label2.Name = "label2";
            this.label2.Size = new System.Drawing.Size(93, 15);
            this.label2.TabIndex = 33;
            this.label2.Text = "Valor da compra";
            this.label2.TextAlign = System.Drawing.ContentAlignment.TopCenter;
            // 
            // textPrecoCompra
            // 
            this.textPrecoCompra.Enabled = false;
            this.textPrecoCompra.Location = new System.Drawing.Point(311, 322);
            this.textPrecoCompra.Name = "textPrecoCompra";
            this.textPrecoCompra.PlaceholderText = "R$ 0,00";
            this.textPrecoCompra.Size = new System.Drawing.Size(93, 23);
            this.textPrecoCompra.TabIndex = 32;
            // 
            // quantProdCompra
            // 
            this.quantProdCompra.Enabled = false;
            this.quantProdCompra.Location = new System.Drawing.Point(12, 197);
            this.quantProdCompra.Name = "quantProdCompra";
            this.quantProdCompra.Size = new System.Drawing.Size(47, 23);
            this.quantProdCompra.TabIndex = 31;
            // 
            // label1
            // 
            this.label1.AutoSize = true;
            this.label1.Location = new System.Drawing.Point(12, 15);
            this.label1.Name = "label1";
            this.label1.Size = new System.Drawing.Size(55, 15);
            this.label1.TabIndex = 30;
            this.label1.Text = "Produtos";
            // 
            // buttonRegistraCompra
            // 
            this.buttonRegistraCompra.Enabled = false;
            this.buttonRegistraCompra.Location = new System.Drawing.Point(311, 351);
            this.buttonRegistraCompra.Name = "buttonRegistraCompra";
            this.buttonRegistraCompra.Size = new System.Drawing.Size(149, 23);
            this.buttonRegistraCompra.TabIndex = 29;
            this.buttonRegistraCompra.Text = "Registrar Compra";
            this.buttonRegistraCompra.UseVisualStyleBackColor = true;
            this.buttonRegistraCompra.Click += new System.EventHandler(this.buttonRegistraCompra_Click);
            // 
            // textBuscaProduto
            // 
            this.textBuscaProduto.Location = new System.Drawing.Point(73, 12);
            this.textBuscaProduto.Name = "textBuscaProduto";
            this.textBuscaProduto.PlaceholderText = "Nome do Produto";
            this.textBuscaProduto.Size = new System.Drawing.Size(143, 23);
            this.textBuscaProduto.TabIndex = 45;
            // 
            // buttonBuscaProd
            // 
            this.buttonBuscaProd.Location = new System.Drawing.Point(222, 11);
            this.buttonBuscaProd.Name = "buttonBuscaProd";
            this.buttonBuscaProd.Size = new System.Drawing.Size(75, 23);
            this.buttonBuscaProd.TabIndex = 46;
            this.buttonBuscaProd.Text = "Buscar Produto";
            this.buttonBuscaProd.UseVisualStyleBackColor = true;
            // 
            // Fornecedor
            // 
            this.Fornecedor.AutoSize = true;
            this.Fornecedor.Location = new System.Drawing.Point(12, 240);
            this.Fornecedor.Name = "Fornecedor";
            this.Fornecedor.Size = new System.Drawing.Size(67, 15);
            this.Fornecedor.TabIndex = 47;
            this.Fornecedor.Text = "Fornecedor";
            // 
            // fornecedor_anonimo
            // 
            this.fornecedor_anonimo.AutoSize = true;
            this.fornecedor_anonimo.Location = new System.Drawing.Point(12, 388);
            this.fornecedor_anonimo.Name = "fornecedor_anonimo";
            this.fornecedor_anonimo.Size = new System.Drawing.Size(99, 19);
            this.fornecedor_anonimo.TabIndex = 48;
            this.fornecedor_anonimo.Text = "Sem Cadastro";
            this.fornecedor_anonimo.UseVisualStyleBackColor = true;
            this.fornecedor_anonimo.CheckedChanged += new System.EventHandler(this.fornecedor_anonimo_CheckedChanged);
            // 
            // textFornecedor
            // 
            this.textFornecedor.Enabled = false;
            this.textFornecedor.Location = new System.Drawing.Point(466, 277);
            this.textFornecedor.Name = "textFornecedor";
            this.textFornecedor.PlaceholderText = "Nome do Fornecedor";
            this.textFornecedor.Size = new System.Drawing.Size(130, 23);
            this.textFornecedor.TabIndex = 49;
            // 
            // label5
            // 
            this.label5.AutoSize = true;
            this.label5.Location = new System.Drawing.Point(466, 260);
            this.label5.Name = "label5";
            this.label5.Size = new System.Drawing.Size(67, 15);
            this.label5.TabIndex = 50;
            this.label5.Text = "Fornecedor";
            // 
            // Form3
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(7F, 15F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(612, 419);
            this.Controls.Add(this.label5);
            this.Controls.Add(this.textFornecedor);
            this.Controls.Add(this.fornecedor_anonimo);
            this.Controls.Add(this.Fornecedor);
            this.Controls.Add(this.buttonBuscaProd);
            this.Controls.Add(this.textBuscaProduto);
            this.Controls.Add(this.comboTipoCompra);
            this.Controls.Add(this.label4);
            this.Controls.Add(this.buttonRemovProdCompra);
            this.Controls.Add(this.label3);
            this.Controls.Add(this.listViewProdAddCompra);
            this.Controls.Add(this.listViewProdCompra);
            this.Controls.Add(this.buttonAddProdCompra);
            this.Controls.Add(this.listViewFornecedor);
            this.Controls.Add(this.textBox2);
            this.Controls.Add(this.buttonBuscaClienteVenda);
            this.Controls.Add(this.buttonLimparCompra);
            this.Controls.Add(this.label2);
            this.Controls.Add(this.textPrecoCompra);
            this.Controls.Add(this.quantProdCompra);
            this.Controls.Add(this.label1);
            this.Controls.Add(this.buttonRegistraCompra);
            this.Name = "Form3";
            this.Text = "Form3";
            ((System.ComponentModel.ISupportInitialize)(this.quantProdCompra)).EndInit();
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private ComboBox comboTipoCompra;
        private Label label4;
        private Button buttonRemovProdCompra;
        private Label label3;
        private ListView listViewProdAddCompra;
        private ColumnHeader columnId;
        private ColumnHeader columnNome;
        private ColumnHeader columnCategoria;
        private ColumnHeader columnTamanho;
        private ColumnHeader columnQtd;
        private ColumnHeader columnValor;
        private ListView listViewProdCompra;
        private ColumnHeader columnIdPro;
        private ColumnHeader columnNomeProd;
        private ColumnHeader columnCatPro;
        private ColumnHeader columnTam;
        private ColumnHeader columnQuantProd;
        private Button buttonAddProdCompra;
        private ListView listViewFornecedor;
        private ColumnHeader id;
        private ColumnHeader col_name;
        private ColumnHeader col_representante;
        private ColumnHeader columnFixo;
        private TextBox textBox2;
        private Button buttonBuscaClienteVenda;
        private Button buttonLimparCompra;
        private Label label2;
        private TextBox textPrecoCompra;
        private NumericUpDown quantProdCompra;
        private Label label1;
        private Button buttonRegistraCompra;
        private TextBox textBuscaProduto;
        private Button buttonBuscaProd;
        private Label Fornecedor;
        private CheckBox fornecedor_anonimo;
        private ColumnHeader columnDivida;
        private TextBox textFornecedor;
        private Label label5;
    }
}